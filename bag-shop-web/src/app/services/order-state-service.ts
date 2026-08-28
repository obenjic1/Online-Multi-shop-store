import { Service, signal } from '@angular/core';
import { OrderResponse } from '../models/order';

@Service()
export class OrderStateService {

  private readonly ORDER_KEY = 'bag-shop-last-order';

  private _order = signal<OrderResponse | null>(
    this.loadOrder()
  );

  readonly order = this._order.asReadonly();

  setOrder(order: OrderResponse): void {

    this._order.set(order);

    sessionStorage.setItem(
      this.ORDER_KEY,
      JSON.stringify(order)
    );
    console.log(this.ORDER_KEY,
      JSON.stringify(order))
  }

  clearOrder(): void {

    this._order.set(null);

    sessionStorage.removeItem(this.ORDER_KEY);
  }

  private loadOrder(): OrderResponse | null {

    const saved = sessionStorage.getItem(this.ORDER_KEY);

    return saved
      ? JSON.parse(saved)
      : null;
  }
}
