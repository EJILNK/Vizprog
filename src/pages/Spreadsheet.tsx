import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { Spreadsheet } from '@components/Spreadsheet/Spreadsheet';
import { loadDocuments, updateDocumentInState } from '@features/Docs/docsSlice';
import type { SpreadsheetDocument } from '@features/Docs/doctypes';

export function SpreadsheetPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const dispatch = useAppDispatch();

  const documents = useAppSelector((state) => state.documents.documents);
  const isLoading = useAppSelector((state) => state.documents.isLoading);

  useEffect(() => {
    if (documents.length === 0) {
      void dispatch(loadDocuments());
    }
  }, [dispatch, documents.length]);

  if (!documentId) {
    return <Navigate to="/dashboard" replace />;
  }

  const activeDocument = documents.find((document) => document.id === documentId);

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

  return <Spreadsheet document={activeDocument} onDocumentChange={handleDocumentChange} />;
}
