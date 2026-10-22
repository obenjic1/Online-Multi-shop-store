import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmitCategoryList } from './admin-category-list';

describe('AdmitCategoryList', () => {
  let component: AdmitCategoryList;
  let fixture: ComponentFixture<AdmitCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmitCategoryList],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmitCategoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
