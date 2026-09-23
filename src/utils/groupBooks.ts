// 5º agrupa livros por uma chave e ordena por tamanhoimport type { Book } from "@/types/book";

import type { Book } from "@/types/book";

export interface BookGroup {
  name: string;
  books: Book[];
}

export function build_book_groups(
  books: Book[],
  // key_fn recebe string[]: um livro pode pertencer a várias séries ou várias missões — a mesma função serve Series e Quest
  key_fn: (book: Book) => string[],
): BookGroup[] {
  const map = new Map<string, Book[]>();
  for (const book of books) {
    for (const key of key_fn(book)) {
      if (!key) continue;
      const list = map.get(key);
      if (list) list.push(book);
      else map.set(key, [book]);
    }
  }
  // ordena por tamanho decrescente: os grupos com mais livros aparecem primeiro
  return [...map.entries()]
    .map(([name, group]) => ({ name, books: group }))
    .sort((a, b) => b.books.length - a.books.length);
}
