import { Route, Routes } from 'react-router-dom';
import AuthGate, { SessionRedirect } from './app/AuthGate';
import { SidebarLayout } from './components/SidebarLayout';
import { InstanceDetailPage } from './pages/InstanceDetailPage';
import { InstancesPage } from './pages/InstancesPage';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <AuthGate>
            <SidebarLayout />
          </AuthGate>
        }
      >
        <Route path="/instances" element={<InstancesPage />} />
        <Route path="/instance/:id" element={<InstanceDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<SessionRedirect />} />
    </Routes>
  );
}
