import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface PublicCategory {
  id: number;
  name: string;
  shopId: number;
  shopName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicCategoryService {

  private http = inject(HttpClient);

  private readonly url =
    `${environment.apiUrl}/public/categories`;


  /**
   * Categories from all active shops.
   */
  findAll(): Observable<PublicCategory[]> {

    return this.http.get<PublicCategory[]>(
      this.url
    );

  }


  /**
   * One category.
   */
  findById(id: number): Observable<PublicCategory> {

    return this.http.get<PublicCategory>(
      `${this.url}/${id}`
    );

  }


  /**
   * Categories belonging to one shop.
   */
  findByShop(slug: string): Observable<PublicCategory[]> {

    return this.http.get<PublicCategory[]>(
      `${this.url}/shop/${slug}`
    );

  }


  /**
   * One category belonging to a specific shop.
   */
  findShopCategory(
    slug: string,
    categoryId: number
  ): Observable<PublicCategory> {

    return this.http.get<PublicCategory>(
      `${this.url}/shop/${slug}/${categoryId}`
    );

  }

}
