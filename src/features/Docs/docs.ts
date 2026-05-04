import { USER_MOCK_ID } from '@features/auth/mockauth';
import type { CreateDocumentData, SpreadsheetDocument } from './doctypes';

const STORAGE_KEY = 'spreadsheet_documents';

function readDocuments(): SpreadsheetDocument[] {
  const rawDocuments = localStorage.getItem(STORAGE_KEY);

  if (!rawDocuments) {
    return [];
  }

  try {
    return JSON.parse(rawDocuments) as SpreadsheetDocument[];
  } catch {
    return [];
  }
}

function saveDocuments(documents: SpreadsheetDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

function createId(): string {
  return crypto.randomUUID();
}

export const docs = {
  getDocuments(): SpreadsheetDocument[] {
    return readDocuments().filter((document) => document.ownerId === USER_MOCK_ID);
  },

  getDocumentById(documentId: string): SpreadsheetDocument | null {
    const documents = readDocuments();

    return (
      documents.find(
        (document) => document.id === documentId && document.ownerId === USER_MOCK_ID,
      ) ?? null
    );
  },

  createDocument(data: CreateDocumentData): SpreadsheetDocument {
    const documents = readDocuments();
    const now = new Date().toISOString();

    const newDocument: SpreadsheetDocument = {
      id: createId(),
      title: data.title,
      rowsCount: data.rowsCount,
      columnsCount: data.columnsCount,
      cells: {},
      createdAt: now,
      updatedAt: now,
      ownerId: USER_MOCK_ID,
    };

    saveDocuments([...documents, newDocument]);

    return newDocument;
  },

  updateDocument(
    documentId: string,
    data: Partial<Omit<SpreadsheetDocument, 'id' | 'createdAt' | 'ownerId'>>,
  ): SpreadsheetDocument | null {
    const documents = readDocuments();
    let updatedDocument: SpreadsheetDocument | null = null;

    const updatedDocuments = documents.map((document) => {
      if (document.id !== documentId || document.ownerId !== USER_MOCK_ID) {
        return document;
      }

      updatedDocument = {
        ...document,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return updatedDocument;
    });

    saveDocuments(updatedDocuments);

    return updatedDocument;
  },

  deleteDocument(documentId: string): void {
    const documents = readDocuments();

    const filteredDocuments = documents.filter((document) => {
      return !(document.id === documentId && document.ownerId === USER_MOCK_ID);
    });

    saveDocuments(filteredDocuments);
  },

  duplicateDocument(documentId: string): SpreadsheetDocument | null {
    const document = this.getDocumentById(documentId);

    if (!document) {
      return null;
    }

    const documents = readDocuments();
    const now = new Date().toISOString();

    const duplicatedDocument: SpreadsheetDocument = {
      ...document,
      id: createId(),
      title: `${document.title} — копия`,
      createdAt: now,
      updatedAt: now,
    };

    saveDocuments([...documents, duplicatedDocument]);

    return duplicatedDocument;
  },
};