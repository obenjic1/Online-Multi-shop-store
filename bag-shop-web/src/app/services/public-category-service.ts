import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PublicCategory {
  id: number;
  name: string;
  shopId: number;
  shopName: string;
  shopSlug: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicCategoryService {

  private http = inject(HttpClient);

  private readonly API_URL = environment.apiUrl + "/public/categories";

  findAll(): Observable<PublicCategory[]> {
    return this.http.get<PublicCategory[]>(this.API_URL);
  }

  findByShop(slug: string): Observable<PublicCategory[]> {
    return this.http.get<PublicCategory[]>(
      `${this.API_URL}/shop/${slug}`
    );
  }

  findById(id: number): Observable<PublicCategory> {
    return this.http.get<PublicCategory>(
      `${this.API_URL}/${id}`
    );
  }

  findShopCategory(
    slug: string,
    categoryId: number
  ): Observable<PublicCategory> {

    return this.http.get<PublicCategory>(
      `${this.API_URL}/shop/${slug}/${categoryId}`
    );
  }
}
