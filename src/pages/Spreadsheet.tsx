import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { Spreadsheet } from '@components/Spreadsheet/Spreadsheet';
import {
  loadDocuments,
  updateDocumentInState,
  setActiveDocumentId,
} from '@features/Docs/docsSlice';
import type { SpreadsheetDocument } from '@features/Docs/doctypes';

import { setHasUnsavedChanges } from '@features/ui/uiSlice';

export function SpreadsheetPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const dispatch = useAppDispatch();

  const hasUnsavedChanges = useAppSelector((state) => state.ui.hasUnsavedChanges);

  const documents = useAppSelector((state) => state.documents.documents);
  const isLoading = useAppSelector((state) => state.documents.isLoading);

  const navigate = useNavigate();

  useEffect(() => {
    if (documents.length === 0) {
      void dispatch(loadDocuments());
    }
  }, [dispatch, documents.length]);

  useEffect(() => {
    if (!documentId) {
      return;
    }

    dispatch(setActiveDocumentId(documentId));
  }, [dispatch, documentId]);

  if (!documentId) {
    return <Navigate to="/dashboard" replace />;
  }

  const activeDocument = documents.find((document) => document.id === documentId);

  function handleBackToDashboard(): void {
  if (hasUnsavedChanges) {
    const shouldLeave = window.confirm(
      'Есть несохранённые изменения. Вы точно хотите покинуть страницу?',
    );

    if (!shouldLeave) {
      return;
    }

    dispatch(setHasUnsavedChanges(false));
  }

  navigate('/dashboard');
}

  function handleDocumentChange(updatedDocument: SpreadsheetDocument): void {
    dispatch(updateDocumentInState(updatedDocument));
  }

  if (!activeDocument && isLoading) {
    return <div className="page">Загрузка документа</div>;
  }

  if (!activeDocument) {
    return (
      <div className="page">
        <h1>Документ не найден</h1>

        <p>Возможно, он был удалён или у вас нет доступа.</p>

        <Link to="/dashboard">Вернуться к документам</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="document_top_bar">
        <button type="button" onClick={handleBackToDashboard}>
          ← Назад к документам
        </button>

        <strong>{activeDocument.title}</strong>
      </div>

      <Spreadsheet document={activeDocument} onDocumentChange={handleDocumentChange} />
    </div>
  );
}
