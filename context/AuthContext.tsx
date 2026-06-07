import React, { createContext, useContext, useMemo, useState } from 'react';
import { CustomerProfile, login as apiLogin } from '../services/api';

type AuthState = {
  customerId: string | null;
  profile: CustomerProfile | null;
  isLoggedIn: boolean;
  signIn: (customerId: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  // Login: pide el perfil al back y lo guarda en memoria.
  // (Sesión solo en memoria: si recargas la app, vuelves a iniciar sesión.
  //  Para persistirla se podría usar AsyncStorage más adelante.)
  const signIn = async (id: string) => {
    const res = await apiLogin(id);
    setCustomerId(res.customer.customer_id);
    setProfile(res.customer);
  };

  const signOut = () => {
    setCustomerId(null);
    setProfile(null);
  };

  const value = useMemo<AuthState>(
    () => ({
      customerId,
      profile,
      isLoggedIn: !!customerId,
      signIn,
      signOut,
    }),
    [customerId, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
