// 4° é a camada entre as páginas e a API
// centralizar React Query para política de cache única
// cada hook encapsula uma função de fetch do dentro do TanStack Query
// páginas nunca chamam Axios direto

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetch_books,
  fetch_book_options,
  fetch_book_by_id,
  fetch_book_stats,
  fetch_books_paginated,
} from "@/api/books";

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetch_books,
    select: (response) => response.data,
  });
}

export function useBookOptions() {
  return useQuery({
    queryKey: ["bookOptions"],
    queryFn: fetch_book_options,
    staleTime: 1000 * 60 * 30, // 30 min
  });
}

export function useBookById(id: string) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => fetch_book_by_id(id),
    enabled: !!id,
  });
}

export function useBookStats() {
  return useQuery({
    queryKey: ["bookStats"],
    queryFn: fetch_book_stats,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useBooksInfinite(
  pageSize = 50,
  search?: string,
  status?: string,
) {
  return useInfiniteQuery({
    queryKey: ["books", "infinite", pageSize, search, status],
    queryFn: ({ pageParam: page_param }) =>
      fetch_books_paginated({
        pageSize,
        startCursor: page_param,
        status,
        search,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last_page) =>
      last_page.pagination.hasMore
        ? last_page.pagination.nextCursor
        : undefined,
  });
}
