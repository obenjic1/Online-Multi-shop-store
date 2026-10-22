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

  getMyShopOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(
      `${this.API_URL}/shop`
    );
  }

  getMyShopOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(
      `${this.API_URL}/shop/${id}`
    );
  }

  updateOrderStatus(
    id: number,
    status: string
  ): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(
      `${this.API_URL}/shop/${id}/status`,
      null,
      {
        params: {
          status
        }
      }
    );
  }
}
