import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { docs } from './docs';

import type { CreateDocumentData, SpreadsheetDocument } from './doctypes';

type DocumentsState = {
  documents: SpreadsheetDocument[];
  activeDocumentId: string | null;
  isLoading: boolean;
  error: string | null;
};

export const loadDocuments = createAsyncThunk('documents/loadDocuments', async () => {
  return docs.getDocuments();
});

export const createDocumentThunk = createAsyncThunk(
  'documents/createDocument',
  async (data: CreateDocumentData) => {
    return docs.createDocument(data);
  },
);

export const updateDocumentThunk = createAsyncThunk(
  'documents/updateDocument',
  async ({
    documentId,
    data,
  }: {
    documentId: string;
    data: Partial<Omit<SpreadsheetDocument, 'id' | 'createdAt' | 'ownerId'>>;
  }) => {
    const updatedDocument = docs.updateDocument(documentId, data);

    if (!updatedDocument) {
      throw new Error('Документ не найден');
    }

    return updatedDocument;
  },
);

export const deleteDocumentThunk = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId: string) => {
    docs.deleteDocument(documentId);

    return documentId;
  },
);

export const duplicateDocumentThunk = createAsyncThunk(
  'documents/duplicateDocument',
  async (documentId: string) => {
    const duplicatedDocument = docs.duplicateDocument(documentId);

    if (!duplicatedDocument) {
      throw new Error('Документ не найден');
    }

    return duplicatedDocument;
  },
);

const initialState: DocumentsState = {
  documents: [],
  activeDocumentId: null,
  isLoading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments(state, action: PayloadAction<SpreadsheetDocument[]>) {
      state.documents = action.payload;
    },

    setActiveDocumentId(state, action: PayloadAction<string | null>) {
      state.activeDocumentId = action.payload;
    },

    addDocumentToState(state, action: PayloadAction<SpreadsheetDocument>) {
      state.documents.push(action.payload);
    },

    updateDocumentInState(state, action: PayloadAction<SpreadsheetDocument>) {
      state.documents = state.documents.map((document) =>
        document.id === action.payload.id ? action.payload : document,
      );
    },

    deleteDocumentFromState(state, action: PayloadAction<string>) {
      state.documents = state.documents.filter((document) => document.id !== action.payload);
    },

    setDocumentsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(loadDocuments.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось загрузить документы';
      })

      .addCase(createDocumentThunk.fulfilled, (state, action) => {
        state.documents.push(action.payload);
        state.activeDocumentId = action.payload.id;
      })

      .addCase(updateDocumentThunk.fulfilled, (state, action) => {
        state.documents = state.documents.map((document) =>
          document.id === action.payload.id ? action.payload : document,
        );
      })

      .addCase(deleteDocumentThunk.fulfilled, (state, action) => {
        state.documents = state.documents.filter((document) => document.id !== action.payload);

        if (state.activeDocumentId === action.payload) {
          state.activeDocumentId = null;
        }
      })

      .addCase(duplicateDocumentThunk.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      });
  },
});

export const {
  setDocuments,
  setActiveDocumentId,
  addDocumentToState,
  updateDocumentInState,
  deleteDocumentFromState,
  setDocumentsError,
} = documentsSlice.actions;

export const documentsReducer = documentsSlice.reducer;
