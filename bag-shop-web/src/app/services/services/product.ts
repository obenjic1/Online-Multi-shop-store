import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductImage } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private http = inject(HttpClient);

  private readonly url = `${environment.apiUrl}/products`;

  // =========================
  // ADMIN / AUTHENTICATED
  // =========================

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(data: any): Observable<Product> {
    return this.http.post<Product>(this.url, data);
  }

  update(id: number, data: any): Observable<Product> {
    return this.http.put<Product>(
      `${this.url}/${id}`,
      data
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  uploadImages(
    productId: number,
    files: File[]
  ): Observable<string> {

    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post(
      `${this.url}/${productId}/images`,
      formData,
      { responseType: 'text' }
    );
  }

  findImages(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(
      `${this.url}/${productId}/images`
    );
  }

  deleteImage(
    productId: number,
    imageId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.url}/${productId}/images/${imageId}`
    );
  }


  // =========================
  // PUBLIC
  // =========================

  findPublicAll(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${environment.apiUrl}/public/products`
    );
  }

  findPublicByShop(slug: string): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${environment.apiUrl}/public/products/shop/${slug}`
    );
  }


  findPublicById(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/public/products/${id}`
    );
  }



  findPublicShopProduct(
    slug: string,
    productId: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${environment.apiUrl}/public/products/shop/${slug}/${productId}`
    );
  }
}
