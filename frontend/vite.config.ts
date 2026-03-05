import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux state management
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-saga'],
          // UI primitives (Radix)
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-switch',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-avatar',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slider',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-progress',
            '@radix-ui/react-slot',
          ],
          // Charts
          'vendor-recharts': ['recharts'],
          // Forms & validation
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Table
          'vendor-table': ['@tanstack/react-table'],
          // Utilities
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react'],
        },
      },
    },
  },
})
