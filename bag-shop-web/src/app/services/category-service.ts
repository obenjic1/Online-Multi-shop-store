import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  Category,
  PublicCategory
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  private readonly url =
    `${environment.apiUrl}/categories`;

  private readonly publicUrl =
    `${environment.apiUrl}/public/categories`;


  // =========================
  // ADMIN
  // =========================

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${this.url}/${id}`
    );
  }

  create(data: { name: string }): Observable<Category> {
    return this.http.post<Category>(
      this.url,
      data
    );
  }

  update(
    id: number,
    data: { name: string }
  ): Observable<Category> {

    return this.http.put<Category>(
      `${this.url}/${id}`,
      data
    );
  }

  delete(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }


  // =========================
  // PUBLIC
  // =========================

  findPublicAll(): Observable<PublicCategory[]> {

    return this.http.get<PublicCategory[]>(
      this.publicUrl
    );
  }

  findPublicById(
    id: number
  ): Observable<PublicCategory> {

    return this.http.get<PublicCategory>(
      `${this.publicUrl}/${id}`
    );
  }

  findPublicByShop(
    slug: string
  ): Observable<PublicCategory[]> {

    return this.http.get<PublicCategory[]>(
      `${this.publicUrl}/shop/${slug}`
    );
  }

  findPublicShopCategory(
    slug: string,
    categoryId: number
  ): Observable<PublicCategory> {

    return this.http.get<PublicCategory>(
      `${this.publicUrl}/shop/${slug}/${categoryId}`
    );
  }
}
