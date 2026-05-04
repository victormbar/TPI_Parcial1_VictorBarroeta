import type { ICategory } from "./category";

export interface Product {
    id: number;
    eliminado: boolean;
    createdAt: string;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string;
    disponible: boolean;
    categorias: ICategory[];
}

// Interfaz para el carrito: hereda todo de Product y suma la cantidad
export interface CartItem extends Product {
    cantidad: number;
}