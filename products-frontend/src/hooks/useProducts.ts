import { useEffect, useState } from "react";
import { listProducts } from "@/services/products";
import type { Product, PageResponse } from "@/types/product";

export function useProducts() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("name,asc");
  const [search, setSearch] = useState("");

  const [data, setData] = useState<PageResponse<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch() {
    setLoading(true);
    setError(null);
    try {
      const res = await listProducts({ page, size, search, sort });
      setData(res);
    } catch (e) {
      if (
        e &&
        typeof e === "object" &&
        "response" in e &&
        e.response &&
        typeof e.response === "object" &&
        "data" in e.response &&
        e.response.data &&
        typeof e.response.data === "object" &&
        "message" in e.response.data
      ) {
        setError(
          (e.response.data as { message?: string }).message ||
            "Erro ao carregar produtos"
        );
      } else {
        setError("Erro ao carregar produtos");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
    /* eslint-disable-next-line */
  }, [page, size, sort, search]);

  return {
    data,
    loading,
    error,
    page,
    size,
    sort,
    search,
    setPage,
    setSize,
    setSort,
    setSearch,
    refetch: fetch,
  };
}
