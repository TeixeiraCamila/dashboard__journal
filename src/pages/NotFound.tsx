// Página 404 exibida para rotas não encontradas
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="error">
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para o painel</Link>
    </div>
  );
}