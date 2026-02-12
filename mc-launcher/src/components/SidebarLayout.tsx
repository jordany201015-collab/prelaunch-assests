import { Outlet, useNavigate } from 'react-router-dom';
import { CSSProperties, useMemo, useState } from 'react';
import { api } from '../lib/tauri';

const mockInstances = ['alpha', 'beta', 'gamma'];

export function SidebarLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const initials = useMemo(() => 'MC', []);

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 88,
          background: '#1f2937',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 8px'
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
              style={{ ...circleButtonStyle, background: '#374151' }}
            >
              {id.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen((v) => !v)} style={{ ...circleButtonStyle, background: '#4b5563' }}>
            {initials}
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: 52,
                right: 0,
                background: '#fff',
                color: '#111827',
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                minWidth: 140,
                overflow: 'hidden'
              }}
            >
              <button style={dropdownItemStyle} onClick={() => navigate('/settings')}>
                Opciones
              </button>
              <button style={dropdownItemStyle} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24, background: '#f3f4f6' }}>
        <Outlet />
      </main>
    </div>
  );
}

const circleButtonStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  color: 'white',
  background: '#111827',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600
};

const dropdownItemStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  padding: '10px 12px',
  cursor: 'pointer'
};
