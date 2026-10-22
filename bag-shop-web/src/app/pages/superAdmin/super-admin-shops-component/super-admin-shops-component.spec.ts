import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminShopsComponent } from './super-admin-shops-component';

describe('SuperAdminShopsComponent', () => {
  let component: SuperAdminShopsComponent;
  let fixture: ComponentFixture<SuperAdminShopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminShopsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminShopsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
