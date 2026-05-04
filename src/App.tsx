import { useEffect, useState } from 'react';

import { Spreadsheet } from '@components/Spreadsheet/Spreadsheet';
import { docs } from '@features/Docs/docs';
import type { SpreadsheetDocument } from '@features/Docs/doctypes';
import { DashboardPage } from '@pages/Dashboard';

export default function App() {
  const [documents, setDocuments] = useState<SpreadsheetDocument[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  useEffect(() => {
    setDocuments(docs.getDocuments());
  }, []);

  function refreshDocuments(): void {
    setDocuments(docs.getDocuments());
  }

  function handleCreateDocument(): void {
    const title = window.prompt('Название документа', 'Новая таблица');

    if (!title) {
      return;
    }

    const newDocument = docs.createDocument({
      title,
      rowsCount: 100,
      columnsCount: 26,
    });

    refreshDocuments();
    setActiveDocumentId(newDocument.id);
  }

  function handleOpenDocument(documentId: string): void {
    setActiveDocumentId(documentId);
  }

  function handleRenameDocument(documentId: string, title: string): void {
    docs.updateDocument(documentId, {
      title,
    });

    refreshDocuments();
  }

  function handleDeleteDocument(documentId: string): void {
    docs.deleteDocument(documentId);

    if (activeDocumentId === documentId) {
      setActiveDocumentId(null);
    }

    refreshDocuments();
  }

  function handleDuplicateDocument(documentId: string): void {
    docs.duplicateDocument(documentId);
    refreshDocuments();
  }

  if (activeDocumentId) {
    return (
      <div>
        <div className="document_top_bar">
          <button type="button" onClick={() => setActiveDocumentId(null)}>
            Назад к документам
          </button>
        </div>

        <Spreadsheet />
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
