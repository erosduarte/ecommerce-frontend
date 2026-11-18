  export interface Product {
    id: number;
    images: string[];
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    active: boolean;
    stock: number;
    oferta: boolean;
    color: string[];
    size: string[];
  }
