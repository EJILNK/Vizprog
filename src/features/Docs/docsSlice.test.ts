import { describe, expect, it } from 'vitest';

import {
  addDocumentToState,
  deleteDocumentFromState,
  documentsReducer,
  setActiveDocumentId,
  setDocuments,
  setDocumentsError,
  updateDocumentInState,
} from './docsSlice';
import type { SpreadsheetDocument } from './doctypes';

function createTestDocument(id: string, title: string): SpreadsheetDocument {
  return {
    id,
    title,
    rowsCount: 100,
    columnsCount: 26,
    cells: {},
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ownerId: 'user-1',
  };
}

describe('documentsSlice', () => {
  it('sets documents', () => {
    const firstDocument = createTestDocument('1', 'Первый документ');

    const state = documentsReducer(undefined, setDocuments([firstDocument]));

    expect(state.documents).toHaveLength(1);
    expect(state.documents[0]?.title).toBe('Первый документ');
  });

  it('sets active document id', () => {
    const state = documentsReducer(undefined, setActiveDocumentId('document-1'));

    expect(state.activeDocumentId).toBe('document-1');
  });

  it('adds document to state', () => {
    const document = createTestDocument('1', 'Новый документ');

    const state = documentsReducer(undefined, addDocumentToState(document));

    expect(state.documents).toHaveLength(1);
    expect(state.documents[0]?.id).toBe('1');
  });

  it('updates document in state', () => {
    const document = createTestDocument('1', 'Старое название');

    let state = documentsReducer(undefined, setDocuments([document]));

    state = documentsReducer(
      state,
      updateDocumentInState({
        ...document,
        title: 'Новое название',
      }),
    );

    expect(state.documents[0]?.title).toBe('Новое название');
  });

  it('deletes document from state', () => {
    const firstDocument = createTestDocument('1', 'Первый');
    const secondDocument = createTestDocument('2', 'Второй');

    let state = documentsReducer(undefined, setDocuments([firstDocument, secondDocument]));

    state = documentsReducer(state, deleteDocumentFromState('1'));

    expect(state.documents).toHaveLength(1);
    expect(state.documents[0]?.id).toBe('2');
  });

  it('sets error', () => {
    const state = documentsReducer(undefined, setDocumentsError('Ошибка'));

    expect(state.error).toBe('Ошибка');
  });
});
