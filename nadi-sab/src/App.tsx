import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import Content from './pages/Content';
import Cyclists from './pages/Cyclists';
import MapCMS from './pages/MapCMS';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-brand-navy font-bold">Verifying access...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function DashboardHome() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-black font-heading text-brand-navy">Dashboard Home</h1>
      <p className="text-brand-slate mt-4">Welcome to Nadi-SAB Admin. Select an option from the sidebar.</p>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename="/nadi-sab">
        <div className="min-h-screen font-sans text-brand-slate">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="content" element={<Content />} />
              <Route path="cyclists" element={<Cyclists />} />
              <Route path="ride" element={<MapCMS />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
