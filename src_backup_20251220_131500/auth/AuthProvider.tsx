import { ReactNode } from "react";
import { AuthProvider as OIDCProvider } from "react-oidc-context";
import { cognitoConfig } from "./authConfig";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <OIDCProvider {...cognitoConfig}>
      {children}
    </OIDCProvider>
  );
}