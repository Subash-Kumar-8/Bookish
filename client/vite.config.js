import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react';
import  sitemap  from "vite-plugin-sitemap";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), sitemap({
      hostname: 'https://bookish-five.vercel.app'
    })],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});