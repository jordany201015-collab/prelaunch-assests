import { CSSProperties, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/tauri';
import type { DeviceCodeInfo } from '../types';

export function LoginPage() {
  const [info, setInfo] = useState<DeviceCodeInfo | null>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const startLogin = async () => {
    setError('');
    try {
      const device = await api.authStartDeviceCode();
      setInfo(device);
    } catch {
      setError('No se pudo iniciar el flujo de login.');
    }
  };

  const poll = async () => {
    setError('');
    try {
      await api.authPoll();
      navigate('/instances');
    } catch {
      setError('Aún no hay sesión lista.');
    }
  };

  return (
    <div className="neon-bg login">
      <div className="neon-noise" />
      <div className="neon-content" style={loginWrapperStyle}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Login</h1>
          <button onClick={startLogin}>Iniciar sesión con Microsoft</button>
          {info && (
            <div>
              <p>
                <strong>user_code:</strong> {info.userCode}
              </p>
              <button onClick={() => window.open(info.verificationUriComplete, '_blank')}>Abrir navegador</button>
              <button onClick={poll}>Ya inicié sesión</button>
            </div>
          )}
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
        </section>
      </div>
    </div>
  );
}

const loginWrapperStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  padding: 24
};

const cardStyle: CSSProperties = {
  background: 'rgba(17, 24, 39, 0.74)',
  color: '#f9fafb',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.12)',
  padding: 24,
  maxWidth: 540,
  width: '100%',
  boxShadow: '0 14px 50px rgba(0,0,0,0.45)'
};
