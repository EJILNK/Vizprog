import type { CreateDocumentData, SpreadsheetDocument } from './doctypes';

const STORAGE_KEY = 'spreadsheet_documents';

export class DocumentAccessError extends Error {
  constructor() {
    super('403');
    this.name = 'DocumentAccessError';
  }
}

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
  getDocuments(userId: string): SpreadsheetDocument[] {
    return readDocuments().filter((document) => document.ownerId === userId);
  },

  getDocumentById(documentId: string, userId: string): SpreadsheetDocument | null {
    const documents = readDocuments();

    return (
      documents.find((document) => document.id === documentId && document.ownerId === userId) ??
      null
    );
  },

  createDocument(data: CreateDocumentData, userId: string): SpreadsheetDocument {
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
      ownerId: userId,
    };

    saveDocuments([...documents, newDocument]);

    return newDocument;
  },

  updateDocument(
    documentId: string,
    userId: string,
    data: Partial<Omit<SpreadsheetDocument, 'id' | 'createdAt' | 'ownerId'>>,
  ): SpreadsheetDocument | null {
    const documents = readDocuments();
    let updatedDocument: SpreadsheetDocument | null = null;

    const updatedDocuments = documents.map((document) => {
      if (document.id !== documentId || document.ownerId !== userId) {
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

  deleteDocument(documentId: string, userId: string): void {
    const documents = readDocuments();

    const filteredDocuments = documents.filter((document) => {
      return !(document.id === documentId && document.ownerId === userId);
    });

    saveDocuments(filteredDocuments);
  },

  duplicateDocument(documentId: string, userId: string): SpreadsheetDocument | null {
    const document = this.getDocumentById(documentId, userId);

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

  checkDocumentAccess(documentId: string, userId: string): SpreadsheetDocument {
    const documents = readDocuments();
    const document = documents.find((item) => item.id === documentId);

    if (!document) {
      throw new Error('Документ не найден');
    }

    if (document.ownerId !== userId) {
      throw new DocumentAccessError();
    }

    return document;
  },
};
