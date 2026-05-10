import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>Страница не найдена</h1>

      <p>Такой страницы не существует.</p>

      <Link to="/dashboard">Вернуться к документам</Link>
    </div>
  );
}
