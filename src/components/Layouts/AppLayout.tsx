import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

import { useAppSelector } from '@app/hooks';

export function AppLayout() {
  const location = useLocation();

  const { documentId } = useParams<{ documentId: string }>();

  const documentTitle = useAppSelector((state) => {
    if (!documentId) {
      return null;
    }

    return state.documents.documents.find((document) => document.id === documentId)?.title ?? null;
  });
  function renderBreadcrumbs() {
    if (location.pathname.startsWith('/documents/')) {
      return (
        <>
          <Link to="/dashboard">Мои документы</Link>
          <span> → </span>
          <span>{documentTitle ?? 'Документ'}</span>
        </>
      );
    }

    if (location.pathname === '/profile') {
      return (
        <>
          <Link to="/dashboard">Мои документы</Link>
          <span> → </span>
          <span>Профиль</span>
        </>
      );
    }

    return <span>Мои документы</span>;
  }

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
          <div className="breadcrumbs">{renderBreadcrumbs()}</div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
