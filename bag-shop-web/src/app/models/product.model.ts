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
}
