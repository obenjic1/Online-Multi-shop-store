import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductList } from './admin-product-list';

describe('AdminProductList', () => {
  let component: AdminProductList;
  let fixture: ComponentFixture<AdminProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
