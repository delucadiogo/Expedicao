import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Usar proxy reverso do nginx em produção, localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_URL || '/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  register: (username: string, email: string, password: string, roleName: 'expedição' | 'qualidade' | 'suprimentos' | 'admin') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { user: authUser, token } = data;

        const frontendUser: User = {
          id: authUser.id,
          username: authUser.username,
          email: authUser.email,
          role: authUser.role,
        };

        setUser(frontendUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(frontendUser));
        localStorage.setItem('token', token);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Erro no login:', errorData.message);
        return false;
      }
    } catch (error) {
      console.error('Erro na comunicação com o servidor de login:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, roleName: 'expedição' | 'qualidade' | 'suprimentos' | 'admin'): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, roleName }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error('Erro no registro:', errorData.message);
        return false;
      }
    } catch (error) {
      console.error('Erro na comunicação com o servidor de registro:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, register }}>
      {children}
    </AuthContext.Provider>
  );
};
