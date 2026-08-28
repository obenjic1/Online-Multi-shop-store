import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { OrderRequest, OrderResponse } from '../models/order';
import { Observable } from 'rxjs';

@Service()
export class OrderService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8080/api/orders';

  createOrder(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      this.API_URL,
      request
    );
  }
}
