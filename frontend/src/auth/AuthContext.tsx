import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState
} from 'react';

const STORAGE_KEY = 'movie-recommender-user-id';

interface AuthContextValue {
  userId: string;
  isAuthenticated: boolean;
  login: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialUserId(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState<string>(getInitialUserId);

  const value = useMemo<AuthContextValue>(
    () => ({
      userId,
      isAuthenticated: Boolean(userId),
      login(id) {
        const normalizedId = String(id);
        setUserId(normalizedId);
        localStorage.setItem(STORAGE_KEY, normalizedId);
      },
      logout() {
        setUserId('');
        localStorage.removeItem(STORAGE_KEY);
      }
    }),
    [userId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
