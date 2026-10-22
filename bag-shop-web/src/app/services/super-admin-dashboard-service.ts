import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  SuperAdminDashboardResponse
} from '../models/super-admin-dashboard.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminDashboardService {

  private readonly http = inject(HttpClient);

  private readonly API_URL = environment.apiUrl +
    '/super-admin/dashboard';

  getDashboard(): Observable<SuperAdminDashboardResponse> {
    return this.http.get<SuperAdminDashboardResponse>(
      this.API_URL
    );
  }
}
