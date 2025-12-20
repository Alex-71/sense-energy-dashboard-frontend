// src/auth/cognitoConfig.js
import React from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  // Issuer del User Pool (no el dominio del login)
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_9KBwUdkL5",

  // 👇 Este es el client_id correcto (cópialo tal cual)
  client_id: "11oj9f8rajuhm2p57hotqv8skn",

  // 👇 Debe coincidir EXACTO con el callback de Cognito
  redirect_uri: "http://localhost:3000/",

  response_type: "code",

  // 👇 En el mismo orden da igual, pero mismos scopes
  scope: "email openid phone",
};

export function CognitoAuthProvider({ children }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}