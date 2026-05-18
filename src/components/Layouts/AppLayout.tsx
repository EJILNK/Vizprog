import { Link, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setHasUnsavedChanges } from '@features/ui/uiSlice';
import { logoutThunk } from '@features/auth/authSlice';

export function AppLayout() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const location = useLocation();

  const dispatch = useAppDispatch();
  const hasUnsavedChanges = useAppSelector((state) => state.ui.hasUnsavedChanges);

  const { documentId } = useParams<{ documentId: string }>();

  const documentTitle = useAppSelector((state) => {
    if (!documentId) {
      return null;
    }

    return state.documents.documents.find((document) => document.id === documentId)?.title ?? null;
  });

  function handleNavigationClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (!hasUnsavedChanges) {
      return;
    }

    const shouldLeave = window.confirm(
      'Есть несохранённые изменения. Вы точно хотите покинуть страницу?',
    );

    if (!shouldLeave) {
      event.preventDefault();
      return;
    }

    dispatch(setHasUnsavedChanges(false));
  }

  function renderBreadcrumbs() {
    if (location.pathname.startsWith('/documents/')) {
      return (
        <>
          <Link to="/dashboard" onClick={handleNavigationClick}>
            Мои документы
          </Link>
          <span> → </span>
          <span>{documentTitle ?? 'Документ'}</span>
        </>
      );
    }

    if (location.pathname === '/profile') {
      return (
        <>
          <Link to="/dashboard" onClick={handleNavigationClick}>
            Мои документы
          </Link>
          <span> → </span>
          <span>Профиль</span>
        </>
      );
    }

    return <span>Мои документы</span>;
  }

  function handleLogout(): void {
    void dispatch(logoutThunk()).then(() => {
      navigate('/login', {
        replace: true,
      });
    });
  }

  return (
    <div className="app_layout">
      <header className="app_header">
        <Link to="/dashboard" className="app_logo" onClick={handleNavigationClick}>
          Spreadsheet
        </Link>

        <nav className="app_nav">
          <Link to="/dashboard" onClick={handleNavigationClick}>
            Документы
          </Link>
          <Link to="/profile">Профиль</Link>
        </nav>

        <div className="app_user">
          <span>{user?.email}</span>

          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <div className="app_body">
        <aside className="app_sidebar">
          <p>Навигация</p>

          <Link to="/dashboard" onClick={handleNavigationClick}>
            Мои документы
          </Link>
          <Link to="/profile" onClick={handleNavigationClick}>
            Профиль
          </Link>
        </aside>

        <main className="app_main">
          <div className="breadcrumbs">{renderBreadcrumbs()}</div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
