import type { AuthResponse, AuthUser, LoginData, RegisterData, ChangePasswordData } from './types';

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

    const userWithoutPassword: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      registeredAt: newUser.registeredAt,
    };

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

    const userWithoutPassword: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      registeredAt: user.registeredAt,
    };

    return createAuthResponse(userWithoutPassword);
  },

  refreshAccessToken(): string | null {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    return createToken('access');
  },

  changePassword(data: ChangePasswordData): void {
    const users = readUsers();

    const userIndex = users.findIndex((user) => user.id === data.userId);

    if (userIndex === -1) {
      throw new Error('Пользователь не найден.');
    }

    const user = users[userIndex];

    if (user.password !== data.currentPassword) {
      throw new Error('Текущий пароль введён неверно.');
    }

    if (data.newPassword.length < 8) {
      throw new Error('Новый пароль должен быть не короче 8 символов.');
    }

    if (data.newPassword !== data.confirmNewPassword) {
      throw new Error('Новые пароли не совпадают.');
    }

    users[userIndex] = {
      ...user,
      password: data.newPassword,
    };

    saveUsers(users);
  },

  logout(): void {
    removeRefreshToken();
    removeAuthSession();
  },
};
