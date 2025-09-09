import { Search } from "lucide-react";
import { api } from "./api";
import type { PageResponse, Product, ProductRequest } from "@/types/product";

export async function listProducts(params: {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
}): Promise<PageResponse<Product>> {
  const { page = 0, size = 10, search, sort } = params;
  const q: Record<string, string | number> = { page, size };
  if (search !== undefined) q.search = search;
  if (sort !== undefined) q.sort = sort;

  const { data } = await api.get<PageResponse<Product>>("/products", {
    params: q,
  });
  return data;
}

export async function getProduct(id: string) {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(body: ProductRequest) {
  const { data } = await api.post<Product>("/products", body);
  return data;
}

export async function updateProduct(
  id: string,
  partial: Partial<ProductRequest>
) {
  const { data } = await api.put<Product>(`/products/${id}`, partial);
  return data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}
