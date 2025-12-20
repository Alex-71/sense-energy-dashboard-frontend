// src/auth/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  // Mientras Cognito resuelve el estado de la sesión
  if (auth.isLoading) {
    return <p>Verificando sesión...</p>;
  }

  // Si NO está autenticado, lo mandamos a Cognito
  if (!auth.isAuthenticated) {
    auth.signinRedirect({
      state: { from: location.pathname }, // opcional: recordar ruta original
    });
    return <p>Redirigiendo a la página de inicio de sesión...</p>;
  }

  // Si está autenticado, mostramos el contenido protegido
  return children;
}