import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';

@Service()
export class CategoryService {


  private http = inject(HttpClient);

  private readonly url = `${environment.apiUrl}/categories`;

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(data: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.url, data);
  }

  update(id: number, data: { name: string }): Observable<Category> {
    return this.http.put<Category>(
      `${this.url}/${id}`,
      data
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
