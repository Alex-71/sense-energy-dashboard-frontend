// src/App.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import ProtectedRoute from "./auth/ProtectedRoute";

function HomePage() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sense Energy Dashboard</h1>
      <p>Esta es la página pública.</p>

      {auth.isAuthenticated ? (
        <>
          <p>✅ Ya estás autenticado.</p>
          <Link to="/dashboard">Ir al Dashboard</Link>
        </>
      ) : (
        <>
          <p>Debes iniciar sesión para ver el dashboard.</p>
          <button onClick={handleLogin}>Iniciar sesión</button>
        </>
      )}
    </div>
  );
}

function DashboardPage() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sense Energy Dashboard</h1>
      <p>
        ✅ Autenticado como:{" "}
        <strong>{auth.user?.profile?.email}</strong>
      </p>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <hr />
      <p>Aquí después conectamos los gráficos y datos de Sense / AWS.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<HomePage />} />

      {/* Ruta protegida */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 simple */}
      <Route path="*" element={<p style={{ padding: "2rem" }}>Página no encontrada</p>} />
    </Routes>
  );
}