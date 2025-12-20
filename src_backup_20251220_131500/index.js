// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CognitoAuthProvider } from "./auth/cognitoConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <CognitoAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CognitoAuthProvider>
  </React.StrictMode>
);