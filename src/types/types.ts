export interface ProductData {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  properties: Array<string>;
  posters: Array<string>;
  inStock: boolean;
}
