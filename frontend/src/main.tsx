import ReactDOM from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
import { Auth0Provider } from '@auth0/auth0-react';

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <StrictMode>
     <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://horror-helper-backend',
        scope: "openid profile email read:current_user update:user_metadata"
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
