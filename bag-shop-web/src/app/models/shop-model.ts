import { Product, PublicCategory } from "./product.model";

export interface Shop {

  id: number;

  name: string;

  slug: string;

  description?: string;

  logo?: string;

  themeColor?: string;

  phoneNumber?: string;

  whatsappNumber?: string;

  email?: string;

  address?: string;

  city?: string;

  latitude?: number;

  longitude?: number;

  pickupAvailable: boolean;

  deliveryAvailable: boolean;

  active: boolean;

  ownerId?: number;

  ownerUsername?: string;
  accentColor?: string;
  bannerImage?: string;
  banner?: string;
  region?: string;
  landmark?: string;
  deliveryFee?: number;

}


export interface PublicShop {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;

  themeColor?: string;

  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;

  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;

  pickupAvailable: boolean;
  deliveryAvailable: boolean;

  active: boolean;
}

export interface PublicShopPage {
  shop: PublicShop;
  categories: PublicCategory[];
  products: Product[];
}
