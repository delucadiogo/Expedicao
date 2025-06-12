// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // ou '@vitejs/plugin-react' dependendo da sua instalação
import path from 'path';
// import { componentTagger } from 'lovable-tagger'; // Se você não tem este módulo, pode removê-lo

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // ESTA É A SEÇÃO COMPLETA QUE VOCÊ DEVE TER.
    // Certifique-se de que NÃO há linhas 'host' ou 'port' aqui.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001', // Mantenha a porta atualizada
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    // mode === 'development' &&
    // componentTagger(), // Se você não tem este módulo, pode removê-lo
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));