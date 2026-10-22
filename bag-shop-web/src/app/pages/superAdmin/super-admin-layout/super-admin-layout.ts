import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  imports: [RouterLink,
    RouterLinkActive,
    RouterOutlet],
  selector: 'app-super-admin-layout',
  styleUrl: './super-admin-layout.css',
  templateUrl: './super-admin-layout.html',
})
export class SuperAdminLayout { }
