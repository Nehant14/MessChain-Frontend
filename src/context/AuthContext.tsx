import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '../theme';
import { AuthSession } from '../types/auth.types';
import { readStoredSession, writeStoredSession, clearStoredSession } from '../utils/storage';
import { resolveRoleFromEmail } from '../utils/roleResolver';

export interface AuthContextType {
  session: AuthSession | null;
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  bootstrapping: boolean;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginError: string;
  setLoginError: (error: string) => void;
  screen: string;
  setScreen: (screen: string) => void;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const roleHome: Record<Role, string> = {
  admin: 'dashboard',
  student: 'qr-scanner',
  staff: 'dashboard',
};

const createSessionToken = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [screen, setScreen] = useState<string>('dashboard');

  useEffect(() => {
    setScreen(roleHome[role]);
  }, [role]);

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      const storedSession = await readStoredSession();
      if (!mounted) return;

      if (storedSession?.email && storedSession?.role) {
        setSession(storedSession);
        setRole(storedSession.role);
      }

      setBootstrapping(false);
    };

    hydrateSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async () => {
    const email = loginEmail.trim().toLowerCase();
    if (!email || !loginPassword.trim()) {
      setLoginError('Enter both email ID and password.');
      return;
    }

    if (!email.includes('@')) {
      setLoginError('Use a valid email ID.');
      return;
    }

    const nextRole = resolveRoleFromEmail(email);
    const nextSession = { email, role: nextRole, token: createSessionToken() };

    await writeStoredSession(nextSession);
    setSession(nextSession);
    setRole(nextRole);
    setScreen(roleHome[nextRole]);
    setLoginError('');
    setLoginPassword('');
  };

  const handleLogout = async () => {
    await clearStoredSession();
    setSession(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setScreen('dashboard');
    setRole('student');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        role,
        setRole,
        bootstrapping,
        loginEmail,
        setLoginEmail,
        loginPassword,
        setLoginPassword,
        loginError,
        setLoginError,
        screen,
        setScreen,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
