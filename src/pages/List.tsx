import { useBookOptions, useBooksInfinite } from "@/hooks";
import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function List() {
  const [searchParams] = useSearchParams();
  const search_param = searchParams.get("search") || "";

  const [selected_genre, set_selected_genre] = React.useState("");

  const { data, fetchNextPage, hasNextPage, isLoading } = useBooksInfinite(
    50,
    search_param,
  );
  const { data: options } = useBookOptions();
  const genres = options?.Tags || [];
  const books = data?.pages.flatMap((p) => p.data) ?? [];

  const sentinel_ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinel_ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // Toggle de gênero: clica no mesmo gênero para limpar o filtro
  const handle_genre_click = (genre: string) => {
    set_selected_genre((prev_genre) => (prev_genre === genre ? "" : genre));
  };

  // Filtragem client-side nos dados já carregados
  const filtered_books = selected_genre
    ? books.filter((book) => book.genres?.includes(selected_genre))
    : books;

  if (isLoading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <>
      <header>List</header>
      {genres.length > 0 && search_param === "" && (
        <div className="genres-container">
          <button
            type="button"
            className={`tag ${selected_genre === "" ? "active" : ""}`}
            aria-pressed={selected_genre === ""}
            onClick={() => handle_genre_click("")}
          >
            Todos
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              className={`tag ${selected_genre === genre ? "active" : ""}`}
              aria-pressed={selected_genre === genre}
              onClick={() => handle_genre_click(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
      <div className="page-content page-listing">
        {filtered_books.map((book) => (
          <div key={book.id} className="listing-book">
            {book.cover && book.cover.length > 0 && (
              <Link to={`/books/${book.id}`}>
                <img
                  className="book-image"
                  src={book.cover[0]}
                  alt={book.name}
                />
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
