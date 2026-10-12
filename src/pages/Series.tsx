// Página de séries: agrupa os livros por série em cards horizontais
import "@/styles/Series.css";
import { Link } from "react-router-dom";
import { useBooks } from "@/hooks";

import { build_book_groups } from "@/utils/groupBooks";

export function Series() {
  const {
    data: books,
    isLoading: books_loading,
    error: books_error,
  } = useBooks();

  if (books_loading) {
    return <div className="loading">Carregando dados...</div>;
  }
  if (books_error) {
    return (
      <div className="error">Erro ao carregar dados: {books_error.message}</div>
    );
  }

  const all_books = books ?? [];

  const groups = build_book_groups(all_books, (b) =>
    b.bookSeries ? [b.bookSeries] : [],
  );

  const books_in_series = groups.reduce(
    (total, group) => total + group.books.length,
    0,
  );

  return (
    <>
      <header className="main__header">
        <h1 className="main__title">Séries</h1>
        <p className="main__subtitle">
          {groups.length} séries · {books_in_series} livros
        </p>
      </header>
      <div className="groups-page">
        {groups.map(({ name, books: group_books }) => (
          <div key={name} className="group-card">
            <div className="group-card__header">
              <h2 className="group-card__title">{name}</h2>
              <span className="group-card__count">
                {group_books.length}{" "}
                {group_books.length === 1 ? "livro" : "livros"}
              </span>
            </div>
            <div className="group-card__books">
              {group_books.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="group-card__book"
                >
                  {book.cover && book.cover.length > 0 ? (
                    <img
                      className="group-card__cover"
                      src={book.cover[0]}
                      alt={book.name}
                    />
                  ) : (
                    <div className="group-card__cover-placeholder">
                      {book.name[0]}
                    </div>
                  )}
                  <span className="group-card__book-name">{book.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
