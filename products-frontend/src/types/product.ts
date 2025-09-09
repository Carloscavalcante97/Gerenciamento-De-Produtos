export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;                 // numérico cru
  quantity: number;
  favorite: boolean;
  createdAt: string;             // ISO-8601
};

export type ProductRequest = {
  name: string;
  description?: string | null;
  price: number;                 // enviar numérico
  quantity: number;              // >= 1
  favorite?: boolean;
};

// Resposta paginada Spring Data (Page)
export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;    // página atual (0-based)
  size: number;      // tamanho da página
  sort?: unknown;
};