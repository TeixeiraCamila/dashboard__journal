// 3º fetch tipadas por endpoint
// falam com os axios

import { api_client } from "@/api/client";
import type {
  Book,
  BookOptions,
  BooksPaginatedResponse,
  BooksResponse,
  BookStats,
} from "@/types/book";

export const fetch_books = async (): Promise<BooksResponse> => {
  const { data } = await api_client.get("/api/books/all");
  return data;
};

export const fetch_books_paginated = async (params: {
  pageSize?: number;
  startCursor?: string;
  status?: string;
  search?: string;
}): Promise<BooksPaginatedResponse> => {
  const { data } = await api_client.get("/api/books", { params });
  return data;
};

export const fetch_book_options = async (): Promise<BookOptions> => {
  const { data } = await api_client.get("/api/books/options");
  return data;
};

export const fetch_book_by_id = async (id: string): Promise<Book> => {
  const { data } = await api_client.get(`/api/books/${id}`);
  return data;
};

export const fetch_book_stats = async (): Promise<BookStats> => {
  const { data } = await api_client.get("/api/books/stats");
  return data;
};

//  retorno sempre desestruturado (const { data })