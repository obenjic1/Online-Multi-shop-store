import { TestBed } from '@angular/core/testing';
import { PublicCategoryService } from './public-category-service';

describe('PublicCategoryService', () => {
  let service: PublicCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
