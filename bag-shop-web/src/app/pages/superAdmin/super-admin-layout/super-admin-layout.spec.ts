import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminLayout } from './super-admin-layout';

describe('SuperAdminLayout', () => {
  let component: SuperAdminLayout;
  let fixture: ComponentFixture<SuperAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
