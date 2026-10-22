import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';



import Swal from 'sweetalert2';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/user';


@Component({
  selector: 'app-administrators',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './administrators.html',
  styleUrl: './administrators.css'
})
export class Administrators implements OnInit {

  // =========================================================
  // SERVICES
  // =========================================================

  private userService = inject(UserService);
  private fb = inject(FormBuilder);


  // =========================================================
  // STATE
  // =========================================================

  users = signal<User[]>([]);

  loading = signal(false);

  submitting = signal(false);

  searchTerm = signal('');

  editingUser = signal<User | null>(null);

  showForm = signal(false);


  // =========================================================
  // ADMINISTRATORS
  // =========================================================

  administrators = computed(() =>
    this.users().filter(
      user => user.role === 'ROLE_ADMIN'
    )
  );


  // =========================================================
  // FILTERED ADMINISTRATORS
  // =========================================================

  filteredAdministrators = computed(() => {

    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    if (!search) {
      return this.administrators();
    }

    return this.administrators().filter(user =>

      user.username
        ?.toLowerCase()
        .includes(search)

      ||

      user.email
        ?.toLowerCase()
        .includes(search)

      ||

      user.phoneNumber
        ?.toLowerCase()
        .includes(search)

    );

  });


  // =========================================================
  // FORM
  // =========================================================

  adminForm = this.fb.group({

    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    email: [
      ''
    ],

    phoneNumber: [
      ''
    ],

    password: [
      '',
      [
        Validators.minLength(6)
      ]
    ]

  });


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadUsers();

  }


  // =========================================================
  // LOAD USERS
  // =========================================================

  loadUsers(): void {

    this.loading.set(true);

    this.userService
      .getUsers()
      .subscribe({

        next: users => {

          this.users.set(users);

          this.loading.set(false);

        },

        error: error => {

          console.error(
            'Failed to load administrators',
            error
          );

          this.loading.set(false);

          Swal.fire({
            icon: 'error',
            title: 'Unable to load administrators',
            text:
              error.error?.message ||
              'Something went wrong while loading administrators.'
          });

        }

      });

  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(
      input.value
    );

  }


  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  openCreateForm(): void {

    this.editingUser.set(null);

    this.adminForm.reset();

    this.adminForm
      .get('password')
      ?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);

    this.adminForm
      .get('password')
      ?.updateValueAndValidity();

    this.showForm.set(true);

  }


  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  openEditForm(user: User): void {

    this.editingUser.set(user);

    this.adminForm.patchValue({

      username:
        user.username,

      email:
        user.email || '',

      phoneNumber:
        user.phoneNumber || '',

      password:
        ''

    });

    // Password is optional during edit

    this.adminForm
      .get('password')
      ?.clearValidators();

    this.adminForm
      .get('password')
      ?.setValidators([
        Validators.minLength(6)
      ]);

    this.adminForm
      .get('password')
      ?.updateValueAndValidity();

    this.showForm.set(true);

  }


  // =========================================================
  // CLOSE FORM
  // =========================================================

  closeForm(): void {

    if (this.submitting()) {
      return;
    }

    this.showForm.set(false);

    this.editingUser.set(null);

    this.adminForm.reset();

  }


  // =========================================================
  // SAVE
  // =========================================================

  saveAdministrator(): void {

    if (this.adminForm.invalid) {

      this.adminForm.markAllAsTouched();

      return;

    }

    const form =
      this.adminForm.getRawValue();

    const existingUser =
      this.editingUser();


    this.submitting.set(true);


    // =======================================================
    // CREATE
    // =======================================================

    if (!existingUser) {

      this.userService
        .createUser({

          username:
            form.username!,

          email:
            form.email || undefined,

          phoneNumber:
            form.phoneNumber || undefined,

          password:
            form.password!,

          role:
            'ROLE_ADMIN'

        })
        .subscribe({

          next: user => {

            this.users.update(
              users => [
                ...users,
                user
              ]
            );

            this.submitting.set(false);

            this.closeForm();

            Swal.fire({
              icon: 'success',
              title: 'Administrator created',
              text:
                `${user.username} has been added successfully.`,
              timer: 1800,
              showConfirmButton: false
            });

          },

          error: error => {

            this.submitting.set(false);

            Swal.fire({
              icon: 'error',
              title: 'Unable to create administrator',
              text:
                error.error?.message ||
                'Something went wrong while creating the administrator.'
            });

          }

        });

      return;
    }


    // =======================================================
    // UPDATE
    // =======================================================

    this.userService
      .updateUser(
        existingUser.id,
        {

          username:
            form.username!,

          email:
            form.email || undefined,

          phoneNumber:
            form.phoneNumber || undefined,

          password:
            form.password || undefined,

          role:
            'ROLE_ADMIN'

        }
      )
      .subscribe({

        next: updatedUser => {

          this.users.update(
            users =>
              users.map(user =>
                user.id === updatedUser.id
                  ? updatedUser
                  : user
              )
          );

          this.submitting.set(false);

          this.closeForm();

          Swal.fire({
            icon: 'success',
            title: 'Administrator updated',
            text:
              `${updatedUser.username} has been updated successfully.`,
            timer: 1800,
            showConfirmButton: false
          });

        },

        error: error => {

          this.submitting.set(false);

          Swal.fire({
            icon: 'error',
            title: 'Unable to update administrator',
            text:
              error.error?.message ||
              'Something went wrong while updating the administrator.'
          });

        }

      });

  }


  // =========================================================
  // TOGGLE STATUS
  // =========================================================

  toggleStatus(user: User): void {

    const newStatus =
      !user.enabled;

    const action =
      newStatus
        ? 'enable'
        : 'disable';


    Swal.fire({

      title:
        `${newStatus ? 'Enable' : 'Disable'} administrator?`,

      text:
        `${user.username} will be ${newStatus ? 'able' : 'unable'} to log in.`,

      icon:
        'warning',

      showCancelButton:
        true,

      confirmButtonText:
        newStatus
          ? 'Yes, enable'
          : 'Yes, disable',

      cancelButtonText:
        'Cancel'

    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }


      this.userService
        .updateStatus(
          user.id,
          newStatus
        )
        .subscribe({

          next: updatedUser => {

            this.users.update(
              users =>
                users.map(existing =>
                  existing.id === updatedUser.id
                    ? updatedUser
                    : existing
                )
            );

            Swal.fire({
              icon: 'success',
              title:
                `Administrator ${action}d`,
              timer: 1500,
              showConfirmButton: false
            });

          },

          error: error => {

            Swal.fire({
              icon: 'error',
              title: 'Action failed',
              text:
                error.error?.message ||
                'Unable to change administrator status.'
            });

          }

        });

    });

  }


  // =========================================================
  // DELETE
  // =========================================================

  deleteAdministrator(user: User): void {

    Swal.fire({

      title:
        'Delete administrator?',

      text:
        `This will permanently delete ${user.username}.`,

      icon:
        'warning',

      showCancelButton:
        true,

      confirmButtonText:
        'Yes, delete',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#dc3545'

    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }


      this.userService
        .deleteUser(user.id)
        .subscribe({

          next: () => {

            this.users.update(
              users =>
                users.filter(
                  existing =>
                    existing.id !== user.id
                )
            );

            Swal.fire({
              icon: 'success',
              title:
                'Administrator deleted',
              timer: 1500,
              showConfirmButton: false
            });

          },

          error: error => {

            Swal.fire({
              icon: 'error',
              title:
                'Unable to delete administrator',
              text:
                error.error?.message ||
                'Something went wrong while deleting the administrator.'
            });

          }

        });

    });

  }


  // =========================================================
  // FORM HELPERS
  // =========================================================

  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.adminForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }

}
