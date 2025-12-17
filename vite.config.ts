import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Bloque AGREGADO para solucionar el error de conexión
  server: {
    proxy: {
      // Cuando el frontend haga una llamada a '/api/...'
      '/api': {
        // Redirige la llamada a tu servidor backend en el puerto 5000
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false, // Es común deshabilitar SSL/TLS para desarrollo local
      },
    },
  },
});