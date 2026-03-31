export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  images: string[];
  inventory: number;
  categoryId: number;
}
