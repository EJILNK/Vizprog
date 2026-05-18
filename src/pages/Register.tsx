import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { registerThunk } from '@features/auth/authSlice';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const authError = useAppSelector((state) => state.auth.error);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function validateForm(): boolean {
    if (name.trim() === '') {
      setFormError('Введите имя.');
      return false;
    }

    if (!email.includes('@')) {
      setFormError('Введите корректный email.');
      return false;
    }

    if (password.length < 8) {
      setFormError('Пароль должен быть не короче 8 символов.');
      return false;
    }

    if (password !== confirmPassword) {
      setFormError('Пароли не совпадают.');
      return false;
    }

    setFormError('');
    return true;
  }

  function handleSubmit(event: { preventDefault: () => void }): void {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    void dispatch(
      registerThunk({
        name,
        email,
        password,
        confirmPassword,
      }),
    )
      .unwrap()
      .then(() => {
        navigate('/dashboard', {
          replace: true,
        });
      });
  }

  return (
    <div className="auth_page">
      <form className="auth_form" onSubmit={handleSubmit}>
        <h1>Регистрация</h1>

        <label>
          Имя
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ваше имя"
          />
        </label>

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
            placeholder="Минимум 8 символов"
          />
        </label>

        <label>
          Подтверждение пароля
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            placeholder="Повторите пароль"
          />
        </label>

        {(formError || authError) && <p className="auth_error">{formError || authError}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}
