// Página 404 exibida para rotas não encontradas
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="error">
      <p>Page not found.</p>
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
}