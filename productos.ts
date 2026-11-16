import { Product } from './src/app/product.model';

export const Productos: Product[] = [
  {
    id: 1,
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 10.99,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfznUZCtdAM9oP9iVE-jl92qhhszx9wKk2vYtQvomyKg&s=10'],
    category: 'Ropa',
    active: true,
    stock: 15,
    oferta: false,
    color: ['Negro', 'Azul'],
    size: ['S', 'M', 'L']
  },
  {
    id: 2,
    name: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 19.99,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQRqxzQABSd07dKtWq2XOpRM-vmUeweyZjyCXe5VrRzg&s=10'],
    category: 'Calzado',
    active: true,
    stock: 8,
    oferta: true,
    color: ['Blanco', 'Gris'],
    size: ['40', '41', '42', '43']
  },
  {
    id: 3,
    name: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 29.99,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-AM7lQVmckJcee6XaSv5jZBS1hXpWhkBYZFI94mBEWQ&s=10'],
    category: 'Accesorios',
    active: false,
    stock: 0,
    oferta: false,
    color: ['Único'],
    size: ['Única']
  }
];
