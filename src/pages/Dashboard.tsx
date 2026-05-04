import type { SpreadsheetDocument } from '@features/Docs/doctypes';

type DashboardPageProps = {
  documents: SpreadsheetDocument[];
  onCreateDocument: () => void;
  onOpenDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, title: string) => void;
  onDeleteDocument: (documentId: string) => void;
  onDuplicateDocument: (documentId: string) => void;
};

export function DashboardPage({
  documents,
  onCreateDocument,
  onOpenDocument,
  onRenameDocument,
  onDeleteDocument,
  onDuplicateDocument,
}: DashboardPageProps) {
  return (
    <div className="dashboard">
      <div className="dashboard_header">
        <h1>Мои документы</h1>

        <button type="button" onClick={onCreateDocument}>
          Создать документ
        </button>
      </div>

      {documents.length === 0 ? (
        <p className="dashboard_empty">Документов пока нет.</p>
      ) : (
        <div className="documents_list">
          {documents.map((document) => (
            <article key={document.id} className="document_card">
              <input
                className="document_title_input"
                value={document.title}
                onChange={(event) => onRenameDocument(document.id, event.target.value)}
              />

              <div className="document_info">
                <p>Создан: {new Date(document.createdAt).toLocaleString()}</p>
                <p>Изменён: {new Date(document.updatedAt).toLocaleString()}</p>
                <p>
                  Размер: {document.rowsCount} × {document.columnsCount}
                </p>
              </div>

              <div className="document_actions">
                <div className="open_button">
                  <button type="button" onClick={() => onOpenDocument(document.id)}>
                    Открыть
                  </button>
                </div>

                <div className="duplicate_button">
                  <button type="button" onClick={() => onDuplicateDocument(document.id)}>
                    Дублировать
                  </button>
                </div>

                <div className="delete_button">
                  <button
                    type="button"
                    onClick={() => {
                      const isConfirmed = window.confirm('Удалить документ?');

                      if (isConfirmed) {
                        onDeleteDocument(document.id);
                      }
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
