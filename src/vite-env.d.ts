/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_AUTH_URL: string;
  readonly VITE_API_RESTAURANT_URL: string;
  readonly VITE_API_PAIEMENT_URL: string;
  readonly VITE_API_COMMANDES_URL: string;
  readonly VITE_API_TRACKING_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
