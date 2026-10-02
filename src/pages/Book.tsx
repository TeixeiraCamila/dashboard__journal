import "@/styles/Book.css";

import { useBookById } from "@/hooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Book, BookStatus } from "@/types/book";

const status_classes: Record<BookStatus, string> = {
  Read: "book-detail__status--read",
  Reading: "book-detail__status--reading",
  DNF: "book-detail__status--dnf",
  "To be read": "book-detail__status--tbr",
};

const format_date = (iso?: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

// currentPage is often missing; the API sends a block bar ("▰▰▰▱ 40%") as fallback
const progress_percent = (book: Book) => {
  if (book.currentPage && book.totalPages) {
    return Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
  }
  const parsed = book.progress?.match(/(\d+)\s*%/);
  return parsed ? Math.min(100, Number(parsed[1])) : null;
};

const build_facts = (book: Book) =>
  [
    { label: "Status", value: book.status ?? "" },
    { label: "Rating", value: book.rate ?? "" },
    { label: "Format", value: book.type?.join(", ") ?? "" },
    { label: "Pages", value: book.totalPages ? String(book.totalPages) : "" },
    { label: "First published", value: book.firstPublished ?? "" },
    { label: "Publisher", value: book.publishedBy?.join(", ") ?? "" },
    { label: "My copy", value: book.iHaveCopy ? "Yes" : "No" },
    { label: "Series", value: book.bookSeries ?? "" },
    { label: "Literary atlas", value: book.literaryAtlas ?? "" },
    { label: "Read in", value: book.wasReadIn?.join(", ") ?? "" },
  ].filter((fact) => fact.value !== "");

export function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading, error } = useBookById(id ?? "");

  const go_back = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/list");
  };

  if (isLoading) {
    return <div className="loading">Loading data...</div>;
  }
  if (error) {
    return (
      <div className="error">
        <p>Could not load this book.</p>
        <p className="book-detail__error-detail">{error.message}</p>
        <Link to="/list">Back to library</Link>
      </div>
    );
  }
  if (!book) {
    return (
      <div className="error">
        <p>Book not found.</p>
        <Link to="/list">Back to library</Link>
      </div>
    );
  }

  const facts = build_facts(book);
  const percent = progress_percent(book);
  const filled = percent === null ? 0 : Math.round(percent / 10);
  const started = format_date(book.startEnd?.start);
  const finished = format_date(book.startEnd?.end);

  return (
    <article className="book-detail">
      <button type="button" className="book-detail__back" onClick={go_back}>
        <span aria-hidden="true">&larr;</span> Back
      </button>

      <header className="main__header book-detail__header">
        <h1 className="main__title">{book.name}</h1>
        <p className="main__subtitle">
          {book.author?.length ? `by ${book.author.join(", ")}` : "Author unknown"}
        </p>
      </header>

      <div className="book-detail__grid">
        <div className="book-detail__aside">
          {book.cover && book.cover.length > 0 ? (
            <img
              className="book-detail__cover"
              src={book.cover[0]}
              alt={book.name}
            />
          ) : (
            <div className="book-detail__cover book-detail__cover--empty">
              {book.name[0]}
            </div>
          )}
          {book.status && (
            <span
              className={`book-detail__status ${status_classes[book.status] ?? ""}`}
            >
              {book.status}
            </span>
          )}
        </div>

        <dl className="book-detail__facts">
          {facts.map((fact) => (
            <div key={fact.label} className="book-detail__fact">
              <dt className="book-detail__label">{fact.label}</dt>
              <dd className="book-detail__value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {percent !== null && (
        <section className="book-detail__progress">
          <h2 className="section-title">Reading progress</h2>
          <p
            className="book-detail__meter"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${book.name} reading progress`}
          >
            <span className="book-detail__meter-blocks" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < filled
                      ? "book-detail__block book-detail__block--on"
                      : "book-detail__block"
                  }
                >
                  {i < filled ? "\u25b0" : "\u25b1"}
                </span>
              ))}
            </span>
            <span className="book-detail__meter-value">{percent}%</span>
          </p>
          {(started || finished) && (
            <p className="book-detail__dates">
              {started && <span>Started {started}</span>}
              {finished && <span>Finished {finished}</span>}
              {started && !finished && <span>Still reading</span>}
            </p>
          )}
        </section>
      )}

      {book.genres && book.genres.length > 0 && (
        <section className="book-detail__tags">
          <h2 className="section-title">Genres</h2>
          <div className="book-detail__tag-list">
            {book.genres.map((genre) => (
              <span key={genre} className="tag">
                {genre}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
