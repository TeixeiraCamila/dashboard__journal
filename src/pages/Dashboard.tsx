import { useBooks, useBookOptions, useBookStats } from "@/hooks";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import type { BookStats } from "@/types/book";

const colors = ["#A44A3F", "#C89B3C", "#4E7B4F", "#5F5A55", "#E8CFCB"];

// como fallback: o Dashboard renderiza mesmo se /stats falhar — os gráficos ganham estados vazios; o usuário nunca vê tela preta.
const empty_stats: BookStats = {
  totalBooks: 0,
  currentlyReading: [],
  statusCounts: {},
  totalPagesRead: 0,
  averagePagesRead: 0,
  averageRating: "0.0",
  ratingDistribution: {},
  authorsMostRead: [],
  genresDistribution: [],
  statsByYear: [],
  booksReadInYear: 0,
  totalPagesReadInYear: 0,
};

export function Dashboard() {
  //  requisições independentes e paralelas
  const {
    data: books,
    isLoading: books_loading,
    error: books_error,
  } = useBooks();
  const { data: stats, isLoading: stats_loading } = useBookStats();
  const { data: options } = useBookOptions();

  if (books_loading || stats_loading) {
    return <div className="loading">Loading data...</div>;
  }
  if (books_error) {
    return (
      <div className="error">Error loading data: {books_error.message}</div>
    );
  }

  const all_books = books ?? [];

  const s = stats || empty_stats;

  // pizza: statusCounts é um Record<status, quantidade> — vira [{ id, value, label, color }]
  const pie_data = Object.entries(s.statusCounts).map(([id, value], index) => ({
    id,
    value,
    label: id,
    color: colors[index % colors.length],
  }));

  // ordem canônica das notas vem do backend; o fallback cobre options ainda não carregado
  const rate_order = options?.Rate || [
    "❤",
    "⭐⭐⭐⭐⭐",
    "⭐⭐⭐⭐",
    "⭐⭐⭐",
    "⭐⭐",
    "⭐",
  ];

  // conta quantos livros existem por nota (rate é string livre, ex.: "⭐⭐⭐⭐")
  const count_map = all_books.reduce<Record<string, number>>((acc, book) => {
    if (book.status !== "Read" || !book.rate) return acc;
    acc[book.rate] = (acc[book.rate] || 0) + 1;
    return acc;
  }, {});

  // remove as notas sem livros para não mostrar barras zeradas no gráfico
  const bar_data = rate_order
    .map((rate) => ({ rate, count: count_map[rate] || 0 }))
    .filter((d) => d.count > 0);

  // gráfico de linha é temporal: garante os anos em ordem crescente
  const line_data = s.statsByYear
    .map(({ year, count }) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  return (
    <>
      <header className="main__header">
        <h1 className="main__title"> Reading Dashboard</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__value">{s.totalBooks}</span>
          <p className="stat-card__label">Total books</p>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {s.statusCounts["Read"] || 0}
          </span>
          <p className="stat-card__label">Books read</p>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {s.statusCounts["To be read"] || 0}
          </span>
          <p className="stat-card__label"> On the shelf (TBR)</p>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{s.booksReadInYear}</span>
          <p className="stat-card__label">Read this year</p>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{s.averageRating}</span>
          <p className="stat-card__label">Average rating</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-card__title"> Book status</h3>
          <PieChart
            series={[
              {
                data: pie_data,
                innerRadius: 30,
                outerRadius: 90,
                paddingAngle: 2,
              },
            ]}
            width={400}
            height={280}
          />
        </div>
        <div className="chart-card">
          <h3 className="chart-card__title">Rating distribution</h3>
          <BarChart
            dataset={bar_data}
            xAxis={[
              { scaleType: "band", dataKey: "rate", categoryGapRatio: 0.2 },
            ]}
            series={[{ dataKey: "count", color: "#A44A3F" }]}
            width={400}
            height={250}
          />
        </div>
        <div className="chart-card chart-card--full">
          <h3 className="chart-card__title">Books read per year</h3>
          <LineChart
            dataset={line_data}
            xAxis={[{ scaleType: "band", dataKey: "year" }]}
            series={[{ dataKey: "count", color: "#A44A3F", showMark: false }]}
            width={600}
            height={250}
          />
        </div>
      </div>
    </>
  );
}
