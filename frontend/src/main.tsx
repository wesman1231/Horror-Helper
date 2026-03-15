import ReactDOM from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
import { Auth0Provider } from '@auth0/auth0-react';

const root = document.getElementById("root");

if (!sessionStorage.getItem('session_active')) {
    // If this is a brand new session (window was closed), 
    // clear the Auth0 localstorage keys
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('@@auth0spajs@@')) {
            localStorage.removeItem(key);
        }
    });
    
}

ReactDOM.createRoot(root!).render(
  <StrictMode>
     <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://horror-helper-backend',
        scope: "openid profile email read:current_user offline_access update:user_metadata",
        prompt: 'login'
      }}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
