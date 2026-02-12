import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { authPoll, authStartDeviceCode } from '../lib/tauri';

export default function LoginPage() {
  const navigate = useNavigate();
  const [info, setInfo] = useState<{
    userCode: string;
    verificationUriComplete: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await authStartDeviceCode();
      setInfo({
        userCode: res.userCode,
        verificationUriComplete: res.verificationUriComplete
      });
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function poll() {
    setError(null);
    setLoading(true);
    try {
      await authPoll();
      navigate('/instances');
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="neon-bg login">
      <div className="neon-noise" />
      <div className="neon-content" style={loginWrapperStyle}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: 10 }}>Login</h1>
          <p style={{ marginTop: 0, opacity: 0.85 }}>
            Inicia sesión con tu cuenta de Microsoft para usar tu perfil de Minecraft.
          </p>

          <button onClick={startLogin} disabled={loading} style={primaryBtn}>
            {loading ? 'Cargando...' : 'Iniciar sesión con Microsoft'}
          </button>

          {info && (
            <div style={{ marginTop: 16 }}>
              <div style={codeBox}>
                <div style={{ fontSize: 12, opacity: 0.85 }}>Tu código</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 2 }}>{info.userCode}</div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                <button onClick={() => window.open(info.verificationUriComplete, '_blank')} style={secondaryBtn}>
                  Abrir navegador
                </button>
                <button onClick={poll} disabled={loading} style={secondaryBtn}>
                  Ya inicié sesión
                </button>
              </div>
            </div>
          )}

          {error && <p style={{ color: '#fb7185', marginTop: 14 }}>{error}</p>}
        </section>
      </div>
    </div>
  );
}

const loginWrapperStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  padding: 24,
  minHeight: '100vh'
};

const cardStyle: CSSProperties = {
  background: 'rgba(17, 24, 39, 0.74)',
  color: '#f9fafb',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.12)',
  padding: 24,
  maxWidth: 560,
  width: '100%',
  boxShadow: '0 14px 50px rgba(0,0,0,0.45)'
};

const primaryBtn: CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.10)',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
};

const secondaryBtn: CSSProperties = {
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  cursor: 'pointer'
};

const codeBox: CSSProperties = {
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(0,0,0,0.25)',
  padding: 14
};
