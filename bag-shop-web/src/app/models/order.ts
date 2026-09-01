export type FulfillmentType =
  'DELIVERY' |
  'PICKUP';




export interface OrderItemRequest {

  productId: number;

  quantity: number;

}



export interface OrderRequest {

  shopSlug: string;

  customerName: string;

  customerPhone: string;

  customerEmail?: string;

  fulfillmentType: FulfillmentType;

  deliveryAddress?: string;

  deliveryCity?: string;

  items: OrderItemRequest[];
}




export interface OrderItemResponse {

  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

  subtotal: number;

}


export interface OrderResponse {

  id: number;

  orderNumber: string;

  shopId: number;

  shopName: string;

  shopSlug: string;

  shopLogo?: string;


  status: string;

  fulfillmentType: FulfillmentType;

  subtotal: number;

  totalAmount: number;

  customerName: string;

  customerPhone: string;

  customerEmail?: string;


  deliveryAddress?: string;

  deliveryCity?: string;


  createdAt: string;


  items: OrderItemResponse[];

}
