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
    <section style={cardStyle}>
      <h1>Login</h1>
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
  );
}

const cardStyle: CSSProperties = {
  background: 'white',
  borderRadius: 12,
  padding: 24,
  maxWidth: 540
};
