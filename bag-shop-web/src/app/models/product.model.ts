
export interface ProductImage {

  id: number;

  imageUrl: string;

  originalFileName: string;

  primaryImage: boolean;

  displayOrder: number;

}


export interface Category {

  id: number;

  name: string;

}


export interface Product {

  id: number;

  name: string;

  description: string;

  price: number;

  stockQuantity: number;

  active: boolean;

  categoryId: number;

  categoryName: string;

  images: string[];


  shopId?: number;

  shopName?: string;

  shopSlug?: string;

}


export interface PublicCategory {

  id: number;

  name: string;

  shopId: number;

  shopName: string;

  shopSlug?: string;

}


export interface CartItem {

  product: Product;

  quantity: number;


  shopSlug?: string;

  shopId?: number;

}

