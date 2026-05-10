import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks';

import {
  createDocumentThunk,
  deleteDocumentThunk,
  duplicateDocumentThunk,
  loadDocuments,
  setActiveDocumentId,
  updateDocumentInState,
  updateDocumentThunk,
} from '@features/Docs/docsSlice';

import { Spreadsheet } from '@components/Spreadsheet/Spreadsheet';
import type { SpreadsheetDocument } from '@features/Docs/doctypes';
import { DashboardPage } from '@pages/Dashboard';

export default function App() {
  const dispatch = useAppDispatch();

  const documents = useAppSelector((state) => state.documents.documents);
  const activeDocumentId = useAppSelector((state) => state.documents.activeDocumentId);

  useEffect(() => {
    void dispatch(loadDocuments());
  }, [dispatch]);

  function handleCreateDocument(): void {
    const title = window.prompt('Название документа', 'Новая таблица');

    if (!title) {
      return;
    }

    const rowsText = window.prompt('Количество строк', '100');
    const columnsText = window.prompt('Количество столбцов', '26');

    const rowsCount = Number(rowsText);
    const columnsCount = Number(columnsText);

    if (
      !Number.isInteger(rowsCount) ||
      !Number.isInteger(columnsCount) ||
      rowsCount <= 0 ||
      columnsCount <= 0
    ) {
      window.alert('Размер таблицы должен быть положительным целым числом.');
      return;
    }

    void dispatch(
      createDocumentThunk({
        title,
        rowsCount,
        columnsCount,
      }),
    );
  }

  function handleOpenDocument(documentId: string): void {
    dispatch(setActiveDocumentId(documentId));
  }

  function handleRenameDocument(documentId: string, title: string): void {
    void dispatch(
      updateDocumentThunk({
        documentId,
        data: {
          title,
        },
      }),
    );
  }

  function handleDeleteDocument(documentId: string): void {
    void dispatch(deleteDocumentThunk(documentId));
  }

  function handleDuplicateDocument(documentId: string): void {
    void dispatch(duplicateDocumentThunk(documentId));
  }

  function handleDocumentChange(updatedDocument: SpreadsheetDocument): void {
    dispatch(updateDocumentInState(updatedDocument));
  }

  const activeDocument =
    activeDocumentId === null
      ? null
      : (documents.find((document) => document.id === activeDocumentId) ?? null);

  if (activeDocument) {
    return (
      <div>
        <div className="document_top_bar">
          <button type="button" onClick={() => dispatch(setActiveDocumentId(null))}>
            ← Назад к документам
          </button>

          <strong>{activeDocument.title}</strong>
        </div>

        <Spreadsheet document={activeDocument} onDocumentChange={handleDocumentChange} />
      </div>
    );
  }

  return (
    <DashboardPage
      documents={documents}
      onCreateDocument={handleCreateDocument}
      onOpenDocument={handleOpenDocument}
      onRenameDocument={handleRenameDocument}
      onDeleteDocument={handleDeleteDocument}
      onDuplicateDocument={handleDuplicateDocument}
    />
  );
}
