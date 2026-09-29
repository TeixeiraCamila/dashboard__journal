# Reading Dashboard

A personal reading tracker built on top of a Notion API. The backend exposes a
library of books, aggregates, and filter options; this frontend turns that into
four views: a stats dashboard, a top 10 list, series groups, and a full library
browser with infinite scroll.

## Stack

- React 18 + TypeScript
- Vite
- TanStack Query
- MUI X Charts and MUI Icons
- React Router
- Axios

## Running it

```bash
npm install
cp .env.exemple .env   # point VITE_API_URL at your API
npm run dev
```

`VITE_API_URL` falls back to `http://localhost:3000` when unset.

```bash
npm run build   # tsc -b, then vite build
npm run lint    # eslint
npm run preview # serve dist
```

## Routes

| Path       | Page      | What it shows                                              |
| ---------- | --------- | ---------------------------------------------------------- |
| `/`        | Dashboard | Stat cards, status pie, rating bars, reads-per-year line    |
| `/top10`   | Top10     | Five-star books, favorites, most-read authors              |
| `/series`  | Series    | Book series grouped into cards, largest first               |
| `/list`    | List      | Every book with genre filters and infinite scroll           |
| `/books/:id` | Book    | Reserved for the detail page, not built yet                |

## Data layer

The API drives everything. Every page reads through the hooks in
`src/hooks/index.ts`; no page calls Axios directly.

| Hook                | Endpoint                    | Notes                            |
| ------------------- | --------------------------- | -------------------------------- |
| `useBooks`          | `GET /api/books/all`        | Full list, no pagination          |
| `useBooksInfinite`  | `GET /api/books`            | Cursor pagination, 50 per page   |
| `useBookById`       | `GET /api/books/:id`        | Fetched when an id is present    |
| `useBookStats`      | `GET /api/books/stats`      | Cached 5 min                     |
| `useBookOptions`    | `GET /api/books/options`    | Filter values, cached 30 min     |

`useBooksInfinite` pages with a cursor instead of an offset:
`getNextPageParam` returns `pagination.nextCursor` while `hasMore` is true, and
the List page keeps loading when its sentinel scrolls into view.

## Structure

```
src/
  types/book.ts     response contracts, mirrors the backend
  api/              Axios client and typed fetch functions
  hooks/            TanStack Query wrappers
  utils/            book grouping
  pages/            one file per route
  styles/           global tokens plus per-page CSS
```

`src/styles/global.css` holds the design tokens (colors, spacing, fonts) and the
shared shell: grid layout, sidebar, page headers. Each page brings its own
stylesheet.

## Notes

- Genre filtering on the List page runs in the browser against the pages already
  loaded. The paginated endpoint takes no genre parameter, so a filter can show
  a short list while more pages remain.
- The Dashboard falls back to a zeroed `BookStats` object when `/stats` fails, so
  the charts render empty instead of blanking the page.
