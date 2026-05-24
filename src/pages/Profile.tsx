import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { updateUserName, changePasswordThunk } from '@features/auth/authSlice';

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const documentsCount = useAppSelector((state) => state.documents.documents.length);

  const authError = useAppSelector((state) => state.auth.error);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name ?? '');
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="page">
        <h1>Профиль</h1>
        <p>Пользователь не авторизован.</p>
      </div>
    );
  }

  function handleSaveName(): void {
    if (name.trim() === '') {
      setMessage('Имя не может быть пустым.');
      return;
    }

    dispatch(updateUserName(name.trim()));
    setMessage('Имя обновлено.');
  }

  function handleChangePassword(): void {
    if (!user) {
      return;
    }

    void dispatch(
      changePasswordThunk({
        userId: user.id,
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    )
      .unwrap()
      .then(() => {
        setMessage('Пароль успешно изменён.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      })
      .catch((error) => {
        setMessage(String(error));
      });
  }

  return (
    <div className="page">
      <h1>Профиль</h1>

      <div className="profile_card">
        <label className="profile_field">
          Имя
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <p>
          <strong>Почта:</strong> {user.email}
        </p>

        <p>
          <strong>Дата регистрации:</strong> {new Date(user.registeredAt).toLocaleString()}
        </p>

        <p>
          <strong>Количество документов:</strong> {documentsCount}
        </p>

        <div className="profile_password_block">
          <h2>Смена пароля</h2>

          <label className="profile_field">
            Текущий пароль
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>

          <label className="profile_field">
            Новый пароль
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>

          <label className="profile_field">
            Повторите новый пароль
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
            />
          </label>
        </div>

        {(message || authError) && <p className="profile_message">{message || authError}</p>}

        <div className="profile_actions">
          <button type="button" onClick={handleSaveName}>
            Сохранить имя
          </button>

          <button type="button" onClick={handleChangePassword} disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сменить пароль'}
          </button>
        </div>
      </div>
    </div>
  );
}
