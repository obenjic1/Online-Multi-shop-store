import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopDetails } from './shop-details';

describe('ShopDetails', () => {
  let component: ShopDetails;
  let fixture: ComponentFixture<ShopDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
