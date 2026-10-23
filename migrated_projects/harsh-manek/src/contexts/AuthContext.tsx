import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  signInDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null, 
  signOut: async () => {},
  signInDemo: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedDemo = typeof window !== 'undefined' ? sessionStorage.getItem('hm_demo_session') : null;
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setSession(parsed.session);
        setUser(parsed.user);
        setLoading(false);
        return;
      } catch (_) {}
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInDemo = () => {
    const mockUser = {
      id: 'admin-harsh-manek',
      app_metadata: {},
      user_metadata: { full_name: 'CA Harsh Manek' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'harsh.manek@hotmail.com',
    } as unknown as User;

    const mockSession = {
      access_token: 'demo-local-preview-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'demo-refresh-token',
      user: mockUser,
    } as unknown as Session;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hm_demo_session', JSON.stringify({ session: mockSession, user: mockUser }));
    }

    setSession(mockSession);
    setUser(mockUser);
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hm_demo_session');
    }
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    setSession(null);
    setUser(null);
  };

  if (loading) return <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center font-mono text-sm">Loading portal session...</div>;

  return (
    <AuthContext.Provider value={{ session, user, signOut, signInDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

