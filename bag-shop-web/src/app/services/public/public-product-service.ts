import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PublicProductService {

  private http = inject(HttpClient);

  private readonly url =
    `${environment.apiUrl}/public/products`;



  findAll(): Observable<Product[]> {

    return this.http.get<Product[]>(
      this.url
    );

  }



  findById(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.url}/${id}`
    );

  }



  findByShop(slug: string): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.url}/shop/${slug}`
    );

  }



  findShopProduct(
    slug: string,
    productId: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${this.url}/shop/${slug}/${productId}`
    );

  }

}
