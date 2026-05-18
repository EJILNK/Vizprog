import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';

import { docs, DocumentAccessError } from './docs';

import type { CreateDocumentData, SpreadsheetDocument } from './doctypes';

type DocumentsState = {
  documents: SpreadsheetDocument[];
  activeDocumentId: string | null;
  isLoading: boolean;
  error: string | null;
};

export const loadDocuments = createAsyncThunk('documents/loadDocuments', async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const userId = state.auth.user?.id;

  if (!userId) {
    return [];
  }

  return docs.getDocuments(userId);
});

export const createDocumentThunk = createAsyncThunk(
  'documents/createDocument',
  async (data: CreateDocumentData, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('Пользователь не авторизован');
    }

    return docs.createDocument(data, userId);
  },
);

export const updateDocumentThunk = createAsyncThunk(
  'documents/updateDocument',
  async (
    {
      documentId,
      data,
    }: {
      documentId: string;
      data: Partial<Omit<SpreadsheetDocument, 'id' | 'createdAt' | 'ownerId'>>;
    },
    thunkApi,
  ) => {
    const state = thunkApi.getState() as RootState;
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('Пользователь не авторизован');
    }

    const updatedDocument = docs.updateDocument(documentId, userId, data);

    if (!updatedDocument) {
      throw new Error('403');
    }

    return updatedDocument;
  },
);

export const deleteDocumentThunk = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId: string, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('Пользователь не авторизован');
    }

    docs.deleteDocument(documentId, userId);

    return documentId;
  },
);

export const duplicateDocumentThunk = createAsyncThunk(
  'documents/duplicateDocument',
  async (documentId: string, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('Пользователь не авторизован');
    }

    const duplicatedDocument = docs.duplicateDocument(documentId, userId);

    if (!duplicatedDocument) {
      throw new Error('Документ не найден');
    }

    return duplicatedDocument;
  },
);

export const checkDocumentAccessThunk = createAsyncThunk(
  'documents/checkDocumentAccess',
  async (documentId: string, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('Пользователь не авторизован');
    }

    try {
      return docs.checkDocumentAccess(documentId, userId);
    } catch (error) {
      if (error instanceof DocumentAccessError) {
        return thunkApi.rejectWithValue('403');
      }

      return thunkApi.rejectWithValue('404');
    }
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
      })

      .addCase(checkDocumentAccessThunk.fulfilled, (state, action) => {
        state.error = null;
        const existingDocument = state.documents.find(
          (document) => document.id === action.payload.id,
        );

        if (!existingDocument) {
          state.documents.push(action.payload);
          return;
        }

        state.documents = state.documents.map((document) =>
          document.id === action.payload.id ? action.payload : document,
        );
      })
      .addCase(checkDocumentAccessThunk.rejected, (state, action) => {
        if (action.payload === '403') {
          state.error = '403';
          return;
        }

        state.error = 'Документ не найден';
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
