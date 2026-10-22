import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddShop } from './add-shop';

describe('AddShop', () => {
  let component: AddShop;
  let fixture: ComponentFixture<AddShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShop],
    }).compileComponents();

    fixture = TestBed.createComponent(AddShop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
