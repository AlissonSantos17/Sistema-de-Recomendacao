import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
    envPrefix: ['VITE_', 'REACT_APP_'],
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        globals: true,
        css: true
    }
});
