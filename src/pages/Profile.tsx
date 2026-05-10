import { useAppSelector } from '@app/hooks';

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const documentsCount = useAppSelector((state) => state.documents.documents.length);

  return (
    <div className="page">
      <h1>Профиль</h1>

      <div className="profile_card">
        <p>
          <strong>Имя:</strong> {user.name}
        </p>

        <p>
          <strong>Почта:</strong> {user.email}
        </p>

        <p>
          <strong>Количество документов:</strong> {documentsCount}
        </p>
      </div>
    </div>
  );
}
