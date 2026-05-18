import type { AuthResponse, AuthUser, LoginData, RegisterData } from './types';

type StoredUser = AuthUser & {
  password: string;
};

const USERS_STORAGE_KEY = 'spreadsheet_users';
const REFRESH_TOKEN_STORAGE_KEY = 'spreadsheet_refresh_token';
const AUTH_SESSION_STORAGE_KEY = 'spreadsheet_auth_session';

function readUsers(): StoredUser[] {
  const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!rawUsers) {
    return [];
  }

  try {
    return JSON.parse(rawUsers) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function createToken(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function saveRefreshToken(refreshToken: string): void {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

function saveAuthSession(authResponse: AuthResponse): void {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(authResponse));
}

function getAuthSession(): AuthResponse | null {
  const rawSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthResponse;
  } catch {
    return null;
  }
}

function removeAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

function createAuthResponse(user: AuthUser): AuthResponse {
  const accessToken = createToken('access');
  const refreshToken = createToken('refresh');

  const authResponse: AuthResponse = {
    user,
    accessToken,
    refreshToken,
  };

  saveRefreshToken(refreshToken);
  saveAuthSession(authResponse);

  return authResponse;
}

export const authService = {
  getStoredAuthSession(): AuthResponse | null {
    return getAuthSession();
  },
  register(data: RegisterData): AuthResponse {
    const users = readUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    const isEmailTaken = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (isEmailTaken) {
      throw new Error('Пользователь с такой почтой уже существует.');
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      registeredAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    const { password: _password, ...userWithoutPassword } = newUser;

    return createAuthResponse(userWithoutPassword);
  },

  login(data: LoginData): AuthResponse {
    const users = readUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    const user = users.find((storedUser) => {
      return (
        storedUser.email.toLowerCase() === normalizedEmail && storedUser.password === data.password
      );
    });

    if (!user) {
      throw new Error('Неверные авторизационные данные');
    }

    const { password: _password, ...userWithoutPassword } = user;

    return createAuthResponse(userWithoutPassword);
  },

  refreshAccessToken(): string | null {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    return createToken('access');
  },

  logout(): void {
    removeRefreshToken();
    removeAuthSession();
  },
};
