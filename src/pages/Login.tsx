import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { loginThunk } from '@features/auth/authSlice';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const authError = useAppSelector((state) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const locationState = location.state as LocationState | null;
  const redirectPath = locationState?.from?.pathname ?? '/dashboard';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event: { preventDefault: () => void }): void {
    event.preventDefault();

    void dispatch(
      loginThunk({
        email,
        password,
      }),
    )
      .unwrap()
      .then(() => {
        navigate(redirectPath, {
          replace: true,
        });
      });
  }

  return (
    <div className="auth_page">
      <form className="auth_form" onSubmit={handleSubmit}>
        <h1>Вход</h1>

        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="example@mail.com"
          />
        </label>

        <label>
          Пароль
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
          />
        </label>

        {authError && <p className="auth_error">{authError}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
