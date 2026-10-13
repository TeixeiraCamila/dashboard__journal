# AGENTS.md: dashboard__journal

Dashboard de leitura (React 18 + TypeScript + MUI + TanStack Query + Vite). Consome o `notion_api` (domínio **books**) para estatísticas, top 10, séries e listagem com infinite scroll. Somente leitura — sem autenticação.

## Convenções comuns a todos os projetos

### Idioma

- Código de produção, comentários e erros retornados ao cliente: **pt-BR**.
- README.md é o único arquivo de documentação em **inglês** (onde aplicável); o restante (`docs/`, `AGENTS.md`, comentários) é pt-BR.

### Commits (Conventional Commits)

Formato:

```
<type>(<escopo opcional>): <descrição em português>
```

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` refatoração sem mudança de comportamento
- `docs:` documentação
- `chore:` manutenção (deps, config, etc.)
- `style:` formatação/CSS sem mudança de lógica

Regras:

- **Só commitar quando o usuário pedir explicitamente** ("faça commit", "commita", "comita"...)
- Commits atômicos: um commit por funcionalidade/mudança lógica
- Merge commits: manter o padrão gerado pelo Git
- **A cada 5 commits locais** (desde o último push), rodar `git pull` automaticamente

### Comentários

- Explicam o _que_ e o _porquê_, não o _como_ (o código já mostra o como)
- Topo de arquivo: 1 linha descrevendo a responsabilidade
- Topo de função/componente: 1–2 linhas
- Inline: reservado para lógica não óbvia ou decisão de design
- Marcadores visuais em logs: ✅ ❌ 🔍 ⚡ 📝
- Máximo 3 linhas por comentário

### JavaScript

- Identificadores próprios (variáveis, funções e parâmetros) em **snake_case**
- Componentes, chaves de dados/API e APIs de bibliotecas seguem a convenção do ecossistema

## Comandos

- `npm run dev`: servidor de desenvolvimento (Vite).
- `npm run build`: type-check (`tsc -b`) + build de produção.
- `npm run lint`: ESLint. Rodar após edições.
- `npm run preview`: preview do build.

## Stack

- **React 18** + **TypeScript**, Vite 8 com alias `@/ → src`.
- **MUI 9**: só `@mui/x-charts` (gráficos) e `@mui/icons-material` (ícones); sem `ThemeProvider`/`sx`.
- **TanStack Query v5**: `useQuery` e `useInfiniteQuery` (cursor), com `staleTime` por query.
- **React Router 7** (`BrowserRouter`).
- **Axios**: client centralizado em `src/api/client.ts`; páginas nunca chamam Axios direto.
- **CSS puro** com tokens em `src/styles/global.css` e classes no estilo BEM.

## TypeScript

- `snake_case` para identificadores próprios; componentes em PascalCase e hooks `useX`.
- Tipos/interfaces próprios em PascalCase (ex.: `Book`, `BookStats`).
- Contratos espelham a resposta do `notion_api`.

## Estrutura

```
src/
├── api/         # client.ts (axios) + fetchers por endpoint
├── hooks/       # hooks TanStack Query por recurso
├── pages/       # Dashboard, Top10, Series, List, Book, NotFound
├── styles/      # global.css + CSS por página
├── types/       # contratos de resposta do backend
└── utils/       # build_book_groups
```

## Consumo de API (notion_api)

`GET /api/books`, `GET /api/books/all`, `GET /api/books/:id`, `GET /api/books/options`, `GET /api/books/stats` (todas públicas). Base em `VITE_API_URL`.

```
Pages → hooks (TanStack Query) → api/books.ts → api/client.ts (Axios) → notion_api → Notion CMS
```

## Docs

- `README.md`: visão geral, stack, rotas, camada de dados (inglês).
- `../KANBAN.md` (raiz do workspace): board consolidado dos 5 repositórios (pt-BR).
