import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopEdit } from './shop-edit';

describe('ShopEdit', () => {
  let component: ShopEdit;
  let fixture: ComponentFixture<ShopEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
