import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop-model';
import { PublicCategory } from './public/public-category';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly http =
    inject(HttpClient);



  private readonly API = `${environment.apiUrl
    }/public/shops`;

  private readonly ADMIN_API = `${environment.apiUrl}/shops`;



  getAllShops(): Observable<Shop[]> {

    return this.http.get<Shop[]>(
      this.API
    );
  }



  getShopBySlug(
    slug: string
  ): Observable<Shop> {

    return this.http.get<Shop>(
      `${this.API}/${slug}`
    );
  }



  getShopPage(
    slug: string
  ): Observable<ShopPage> {

    return this.http.get<ShopPage>(
      `${this.API}/${slug}/page`
    );
  }



  createShop(
    request: ShopRequest
  ): Observable<Shop> {

    return this.http.post<Shop>(
      this.ADMIN_API,
      request
    );
  }

  getMyShop(): Observable<Shop> {
    return this.http.get<Shop>(
      `${this.ADMIN_API}/me`
    );
  }


  updateMyShop(request: ShopRequest): Observable<Shop> {
    return this.http.put<Shop>(
      `${this.ADMIN_API}/me`,
      request
    );
  }

}



export interface ShopPage {

  shop: Shop;

  categories: PublicCategory[];

  products: Product[];

}


// =============================================================
// CREATE SHOP REQUEST
// =============================================================

export interface ShopRequest {
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  themeColor?: string;
  accentColor?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  landmark?: string;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  deliveryFee?: number;
  ownerId?: number;
}
