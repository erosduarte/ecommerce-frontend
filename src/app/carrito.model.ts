export interface ItemCarrito {
  id: string;
  productId: number;
  name: string;
  price: number;
  images: string[];
  cantidad: number;
  talla: string | null;
  color: string | null;
}
