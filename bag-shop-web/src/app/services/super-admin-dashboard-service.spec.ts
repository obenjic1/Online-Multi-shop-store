import { TestBed } from '@angular/core/testing';
import { SuperAdminDashboardService } from './super-admin-dashboard-service';

describe('SuperAdminDashboardService', () => {
  let service: SuperAdminDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
