import { defineConfig } from 'vite'
import { terserOptions } from './config/build/terserOptions'
import { createRollupOptions } from './config/build/rollupOptions'
import { buildPlugins } from './config/build/plugins'

const rollupOptions = createRollupOptions()

export default defineConfig({
    server: {
        port: 5173,
    },
    build: {
        target: 'es2018',
        minify: 'terser',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        terserOptions,
        rollupOptions,
    },
    plugins: buildPlugins
})
