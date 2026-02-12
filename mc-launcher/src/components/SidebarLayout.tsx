import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../lib/tauri';

const circleButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.06)',
  color: 'white',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center'
};

const dropdownItemStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: '10px 12px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14
};

const glassMainStyle: React.CSSProperties = {
  flex: 1,
  padding: 24,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 18,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  margin: 16,
  color: '#e5e7eb'
};

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock (por ahora)
  const mockInstances = useMemo(() => ['alpha', 'beta', 'gamma'], []);
  const initials = 'MC';

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setMenuOpen(false);
      navigate('/login');
    }
  }

  return (
    <div className="neon-bg instances">
      <div className="neon-noise" />
      <div className="neon-content" style={{ display: 'flex', minHeight: '100vh' }}>
        <aside
          style={{
            width: 88,
            background: 'rgba(15, 23, 42, 0.55)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 8px',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <button onClick={() => navigate('/instances')} style={circleButtonStyle} title="Home">
            🏠
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockInstances.map((id) => (
              <button
                key={id}
                onClick={() => navigate(`/instance/${id}`)}
                title={id}
                style={{ ...circleButtonStyle, background: 'rgba(255,255,255,0.06)' }}
              >
                {id.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ ...circleButtonStyle, background: 'rgba(255,255,255,0.08)' }}
              title="Cuenta"
            >
              {initials}
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 52,
                  right: 0,
                  background: 'rgba(17, 24, 39, 0.95)',
                  color: '#f9fafb',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
                  minWidth: 160,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <button style={dropdownItemStyle} onClick={() => (setMenuOpen(false), navigate('/settings'))}>
                  Opciones
                </button>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <button style={dropdownItemStyle} onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </aside>

        <main style={glassMainStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
