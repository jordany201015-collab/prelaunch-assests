import { PropsWithChildren, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/tauri';
import type { Session } from '../types';

export default function AuthGate({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    api
      .getSession()
      .then((current) => {
        if (!mounted) return;
        setSession(current);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="neon-bg instances">
        <div className="neon-noise" />
        <div
          className="neon-content"
          style={{ display: 'grid', placeItems: 'center', color: '#e5e7eb', fontSize: 18, letterSpacing: 0.4 }}
        >
          Cargando sesión...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function SessionRedirect() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    api
      .getSession()
      .then((current) => {
        if (!mounted) return;
        setSession(current);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="neon-bg instances">
        <div className="neon-noise" />
        <div className="neon-content" style={{ display: 'grid', placeItems: 'center', color: '#e5e7eb' }}>
          Cargando...
        </div>
      </div>
    );
  }

  return <Navigate to={session ? '/instances' : '/login'} replace />;
}
