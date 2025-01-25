import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/Auth.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="277544899558-9uvnch7t2elrpuel1g175uml96n6p61m.apps.googleusercontent.com">
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
  </GoogleOAuthProvider>
);
