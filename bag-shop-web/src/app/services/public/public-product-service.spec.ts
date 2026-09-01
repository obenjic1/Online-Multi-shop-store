import { TestBed } from '@angular/core/testing';
import { PublicProductService } from './public-product-service';

describe('PublicProductService', () => {
  let service: PublicProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
