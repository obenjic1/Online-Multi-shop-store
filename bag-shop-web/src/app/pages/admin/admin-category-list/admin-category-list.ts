import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CategoryService } from '../../../services/category-service';
import { Category } from '../../../models/product.model';
import { SweetAlertService } from '../../../services/sweet-alert-service';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-category-list.html',
  styleUrl: './admin-category-list.css'
})
export class AdminCategoryList implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);
  private sweetAlert = inject(SweetAlertService)

  categories = signal<Category[]>([]);

  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);

  searchTerm = signal('');

  editingCategory = signal<Category | null>(null);

  errorMessage = signal('');
  successMessage = signal('');

  categoryForm = this.fb.nonNullable.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]]
  });

  filteredCategories = computed(() => {

    const search = this.searchTerm()
      .trim()
      .toLowerCase();

    if (!search) {
      return this.categories();
    }

    return this.categories().filter(category =>
      category.name
        .toLowerCase()
        .includes(search)
    );
  });

  totalCategories = computed(
    () => this.categories().length
  );

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.categoryService.findAll().subscribe({

      next: categories => {

        this.categories.set(categories ?? []);
        this.loading.set(false);
      },

      error: error => {

        console.error(
          'CATEGORY LOAD ERROR:',
          error
        );

        this.errorMessage.set(
          'Unable to load your categories.'
        );

        this.loading.set(false);
      }
    });
  }

  openAddModal(): void {

    this.editingCategory.set(null);

    this.categoryForm.reset({
      name: ''
    });

    this.errorMessage.set('');
    this.successMessage.set('');
  }

  openEditModal(category: Category): void {

    this.editingCategory.set(category);

    this.categoryForm.reset({
      name: category.name
    });

    this.errorMessage.set('');
    this.successMessage.set('');
  }

  saveCategory(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;
    }

    const name = this.categoryForm.controls.name.value.trim();

    if (!name) {

      this.categoryForm.controls.name.setErrors({
        required: true
      });

      this.categoryForm.controls.name.markAsTouched();

      return;
    }

    this.saving.set(true);

    const editing = this.editingCategory();

    if (editing) {

      this.categoryService.update(
        editing.id,
        { name }
      ).subscribe({

        next: updatedCategory => {

          this.categories.update(categories =>
            categories.map(category =>
              category.id === updatedCategory.id
                ? updatedCategory
                : category
            )
          );

          this.saving.set(false);

          this.successMessage.set(
            'Category updated successfully.'
          );

          this.closeModal();
        },

        error: error => {

          console.error(
            'CATEGORY UPDATE ERROR:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to update category.'
          );

          this.saving.set(false);
        }
      });

      return;
    }

    this.categoryService.create({ name }).subscribe({

      next: category => {

        this.categories.update(categories => [
          category,
          ...categories
        ]);

        this.saving.set(false);

        this.successMessage.set(
          'Category created successfully.'
        );

        this.closeModal();
      },

      error: error => {

        console.error(
          'CATEGORY CREATE ERROR:',
          error
        );

        this.errorMessage.set(
          error?.error?.message ||
          'Unable to create category.'
        );

        this.saving.set(false);
      }
    });
  }

  deleteCategory(category: Category): void {



    this.sweetAlert.confirm('Confirm Delete ', `Are you sure you want to delete this ${category.name}?`).then((result) => {

      if (result.isConfirmed) {
        this.deleting.set(true);
        this.errorMessage.set('');



        this.categoryService.delete(category.id).subscribe({

          next: () => {

            this.categories.update(categories =>
              categories.filter(
                item => item.id !== category.id
              )
            );

            this.deleting.set(false);

            this.successMessage.set(
              `"${category.name}" was deleted successfully.`
            );
          },

          error: error => {

            console.error(
              'CATEGORY DELETE ERROR:',
              error
            );

            this.errorMessage.set(
              error?.error?.message ||
              'Unable to delete category.'
            );

            this.deleting.set(false);
          }
        });
      } else {
        return;
      }

    });



  }

  closeModal(): void {

    const modalElement =
      document.getElementById('categoryModal');

    if (modalElement) {

      const modal =
        (window as any).bootstrap?.Modal
          ?.getInstance(modalElement);

      modal?.hide();
    }
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}
