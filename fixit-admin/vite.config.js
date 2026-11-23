import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: '../public',
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        globals: true,
        css: true,
    },
});
