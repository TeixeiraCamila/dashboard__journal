// 1ª contrato dos dados
// todos os arquivos dependem desses tipos
// espelha resposta do backend notion_api

export interface Book {
  id: string;
  name: string;
  author: string[];
  status?: string | null;
  rate?: string | null;
  wasReadIn?: string[];
  genres?: string[];
  totalPages?: number | null;
  currentlyOn?: number | null;
  bookSeries?: string | null;
  type?: string[];
  cover?: string[];
  startEnd?: { start: string; end?: string; time_zone?: string | null } | null;
  literaryAtlas?: string | null;
  iHaveCopy?: boolean;
  firstPublished?: string | null;
  progress?: string | null;
  publishedBy?: string[];
  quest?: string[];
}

export interface BookOptions {
  "Was read in": string[];
  Status: string[];
  Atlas: string[];
  Type: string[];
  Rate: string[];
  Tags: string[];
  "First published in": string[];
  "Published by": string[];
  Author: string[];
  "Book Series Name": string[];
}

export interface BookStats {
  totalBooks: number;
  currentlyReading: Book[];
  statusCounts: Record<string, number>;
  totalPagesRead: number;
  averagePagesRead: number;
  averageRating: string;
  ratingDistribution: Record<string, number>;
  authorsMostRead: { name: string; count: number }[];
  genresDistribution: { name: string; count: number }[];
  statsByYear: { year: number; count: number }[];
  booksReadInYear: number;
  totalPagesReadInYear: number;
}

export interface BooksResponse {
  data: Book[];
  total: number;
}

export interface BooksPaginatedResponse {
  data: Book[];
  pagination: { pageSize: number; hasMore: boolean; nextCursor: string | null };
}
