import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@components/Layouts/AppLayout';
import { ProtectedRoute } from '@components/Layouts/ProtectedRoute';
import { DashboardPage } from '@pages/Dashboard';
import { NotFoundPage } from '@pages/NFP';
import { ProfilePage } from '@pages/Profile';
import { SpreadsheetPage } from '@pages/Spreadsheet';
import { LoginPage } from '@pages/Login';
import { RegisterPage } from '@pages/Register';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents/:documentId" element={<SpreadsheetPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
