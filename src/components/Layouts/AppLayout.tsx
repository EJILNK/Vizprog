import { Link, Outlet, useLocation } from 'react-router-dom';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="app_layout">
      <header className="app_header">
        <Link to="/dashboard" className="app_logo">
          Spreadsheet
        </Link>

        <nav className="app_nav">
          <Link to="/dashboard">Документы</Link>
          <Link to="/profile">Профиль</Link>
        </nav>
      </header>

      <div className="app_body">
        <aside className="app_sidebar">
          <p>Навигация</p>

          <Link to="/dashboard">Мои документы</Link>
          <Link to="/profile">Профиль</Link>
        </aside>

        <main className="app_main">
          <div className="breadcrumbs">
            {location.pathname.startsWith('/documents/') ? (
              <>
                <Link to="/dashboard">Мои документы</Link>
                <span> → </span>
                <span>Документ</span>
              </>
            ) : (
              <span>Мои документы</span>
            )}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
