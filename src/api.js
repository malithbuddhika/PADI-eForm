// Compute API base so mobile devices on the same LAN can reach the dev server.
// You can override this with VITE_API_BASE in your .env (e.g. VITE_API_BASE=http://192.168.1.50:4000)
export const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:4000`
