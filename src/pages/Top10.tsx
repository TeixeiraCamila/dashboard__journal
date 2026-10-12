// Página Top 10: livros mais bem avaliados, favoritos e autores mais lidos
import "@/styles/Top10.css";
import { Link } from "react-router-dom";
import { useBooks, useBookStats } from "@/hooks";

import { EmojiEvents, Favorite, RateReview } from "@mui/icons-material";

export function Top10() {
  const {
    data: books,
    isLoading: books_loading,
    error: books_error,
  } = useBooks();

  const { data: stats, isLoading: stats_loading } = useBookStats();

  if (books_loading || stats_loading) {
    return <div className="loading">Carregando dados...</div>;
  }
  if (books_error) {
    return (
      <div className="error">Erro ao carregar dados: {books_error.message}</div>
    );
  }

  const read_books = (books ?? []).filter((b) => b.status === "Read");

  const top_rated = read_books
    .filter((b) => b.rate === "⭐⭐⭐⭐⭐")
    .slice(0, 10);

  const favorites = read_books.filter((b) => b.rate === "❤");

  const top_authors = stats?.authorsMostRead ?? [];

  return (
    <>
      <header className="main__header">
        <h1 className="main__title">Top 10</h1>
      </header>
      <section className="top10-section">
        <h2 className="section-title">
          <EmojiEvents /> Melhores livros
        </h2>
        <div className="books-grid">
          {top_rated.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="book-card">
              <h3 className="book-name">{book.name}</h3>
              <p className="book-author">por {book.author?.join(", ") ?? ""}</p>
              <span className="book-rate">{book.rate}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="favorites-section">
        <h2 className="section-title">
          <Favorite /> Favoritos
        </h2>
        <div className="books-list">
          {favorites.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="book-item">
              <span>
                {book.name}
                {book.author?.[0] ? ` por ${book.author[0]}` : ""}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="authors-section">
        <h2 className="section-title">
          <RateReview /> Autores mais lidos
        </h2>
        <div className="authors-list">
          {top_authors.map(({ name, count }, i) => (
            <div key={name} className="author-item">
              <span className="author-rank">#{i + 1}</span>
              <span className="author-name">{name}</span>
              <span className="author-count">{count} livros</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
