export interface Categoria {
  nombre: string;
  categoria: string;
  subcategoria: string | null;
  imagen: string;
  color: string;
}

export interface Coleccion {
  nombre: string;
  categoria: string;
  subcategoria: string | null;
  imagen: string;
}

export interface Pilar {
  titulo: string;
  descripcion: string;
  imagen: string;
  ruta: string;
  params: Record<string, string>;
}

export interface HomeContenido {
  categorias: Categoria[];
  colecciones: Coleccion[];
  pilares: Pilar[];
}

export interface EnlaceMenu {
  texto: string;
  params: Record<string, string>;
}

export interface ColumnaMenu {
  titulo: string;
  enlaces: EnlaceMenu[];
}

export interface DestacadoMenu extends EnlaceMenu {
  imagen: string;
}

export interface SeccionMenu {
  nombre: string;
  params: Record<string, string>;
  columnas: ColumnaMenu[];
  destacados: DestacadoMenu[];
}

export interface EnlaceFooter {
  texto: string;
  ruta: string;
  params?: Record<string, string>;
}

export interface ColumnaFooter {
  titulo: string;
  enlaces: EnlaceFooter[];
}

export interface RedSocial {
  texto: string;
  url: string;
}

export interface FooterContenido {
  columnas: ColumnaFooter[];
  redes: RedSocial[];
}