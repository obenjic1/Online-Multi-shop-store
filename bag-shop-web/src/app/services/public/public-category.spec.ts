import { TestBed } from '@angular/core/testing';
import { PublicCategory } from './public-category';

describe('PublicCategory', () => {
  let service: PublicCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
