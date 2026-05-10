import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@app/hooks';
import { getDocumentPreview } from '@features/Docs/doscpreview';
import {
  createDocumentThunk,
  deleteDocumentThunk,
  duplicateDocumentThunk,
  loadDocuments,
  updateDocumentThunk,
} from '@features/Docs/docsSlice';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const documents = useAppSelector((state) => state.documents.documents);

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
    )
      .unwrap()
      .then((createdDocument) => {
        navigate(`/documents/${createdDocument.id}`);
      });
  }

  function handleOpenDocument(documentId: string): void {
    navigate(`/documents/${documentId}`);
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
  return (
    <div className="dashboard">
      <div className="dashboard_header">
        <h1>Мои документы</h1>

        <button type="button" onClick={handleCreateDocument}>
          Создать документ
        </button>
      </div>

      {documents.length === 0 ? (
        <p className="dashboard_empty">Документов пока нет.</p>
      ) : (
        <div className="documents_list">
          {documents.map((document) => {
            const preview = getDocumentPreview(document);

            return (
              <article key={document.id} className="document_card">
                <input
                  className="document_title_input"
                  value={document.title}
                  onChange={(event) => handleRenameDocument(document.id, event.target.value)}
                />

                <div className="document_info">
                  <p>Создан: {new Date(document.createdAt).toLocaleString()}</p>
                  <p>Изменён: {new Date(document.updatedAt).toLocaleString()}</p>
                  <p>
                    Размер: {document.rowsCount} × {document.columnsCount}
                  </p>
                </div>

                <div className="document_preview">
                  {preview.map((row, rowIndex) => (
                    <div key={rowIndex} className="document_preview_row">
                      {row.map((value, columnIndex) => (
                        <div key={columnIndex} className="document_preview_cell">
                          {value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="document_actions">
                  <div className="open_button">
                    <button type="button" onClick={() => handleOpenDocument(document.id)}>
                      Открыть
                    </button>
                  </div>

                  <div className="duplicate_button">
                    <button type="button" onClick={() => handleDuplicateDocument(document.id)}>
                      Дублировать
                    </button>
                  </div>

                  <div className="delete_button">
                    <button
                      type="button"
                      onClick={() => {
                        const isConfirmed = window.confirm('Удалить документ?');

                        if (isConfirmed) {
                          handleDeleteDocument(document.id);
                        }
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
