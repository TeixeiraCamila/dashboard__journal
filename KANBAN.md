# Kanban — dashboard__journal

Dashboard de leitura em React 18 + TypeScript + MUI X Charts + TanStack Query + Vite. Consome o `notion_api` (domínio **books**).

Colunas: **Completo** · **Em desenvolvimento** · **Em pausa** · **Pode ser útil**

## Completo

- **Dashboard com StatCards** — total, lidos, TBR, lidos no ano e nota média (`src/pages/Dashboard.tsx`).
- **Gráficos MUI X Charts** — pizza de status, barras de notas e linha de livros por ano.
- **Fallback de stats zerados** — se `/stats` falhar, renderiza `empty_stats` (gráficos vazios).
- **Top 10, Favoritos e autores mais lidos** — top 5 estrelas, ❤ e `authorsMostRead` (`src/pages/Top10.tsx`).
- **Página Series** — agrupamento por série via `build_book_groups` (`src/pages/Series.tsx`).
- **Biblioteca com infinite scroll** — paginação por cursor com `IntersectionObserver` (`src/pages/List.tsx`).
- **Filtro de gênero por tags** — toggle client-side sobre as páginas carregadas.
- **Detalhe do livro `/books/:id`** — fatos, progresso em blocos, datas de leitura e gêneros (`src/pages/Book.tsx`).
- **Camada de dados em 4 níveis** — `types → api/client → api/books → hooks`; páginas nunca chamam Axios direto.
- **Cache com staleTime por query** — books/stats 5 min, options 30 min.
- **Shell** — sidebar de ícones, headers, 404 e redirect `/dashboard → /`.
- **Design system "editorial retrô"** — tokens em `src/styles/global.css` (borda 2px, sombra dura, paleta terracota).
- **Deploy Vercel** — `VITE_API_URL` apontando para a API em produção.

## Em desenvolvimento

- **Busca na List sem input** — `?search=` é lido e repassado, mas não há caixa de busca na página (só via URL).
- **README defasado** — ainda marca `/books/:id` como "not built yet", mas a página já existe.
- **`GroupCard` específico de séries** — o CSS prevê card genérico, mas só a página de séries usa.

## Em pausa

- **Página "Missões / Quests"** — citada no README raiz e no comentário do `Series.css`, mas sem rota, página ou componente.
- **Filtro de gênero server-side** — o endpoint paginado não aceita gênero; o filtro roda no browser e pode mostrar lista curta.

## Pode ser útil

- **Filtro de gênero no servidor** — adicionar parâmetro em `GET /api/books` para considerar todas as páginas.
- **Exibir "Lendo agora" no Dashboard** — `currentlyReading` já vem no `/stats` e não é consumido.
- **Cards de páginas lidas** — `totalPagesRead`, `averagePagesRead` e `totalPagesReadInYear` sem visual.
- **Gráfico de distribuição de gêneros** — `genresDistribution` no contrato do `/stats`, sem render.
- **Página dedicada de Favoritos** — ❤ aparece só no Top 10.
- **Revisar série/volume no card de busca** — `bookSeries` é string no tipo, mas o backend agrupa `seriesInfo`.
