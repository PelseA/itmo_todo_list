// vite.config.js/** @type {import('vite').UserConfig} */
import path from 'path';
import { defineConfig } from 'vite';
// import mkcert from 'vite-plugin-mkcert';
console.log(import.meta.env)

export default defineConfig({
    // omit
    plugins: [],
    resolve: {
        alias: {
            '@/': `${path.resolve(__dirname, 'src')}/`,
        },
    },
    server: {
        host: '127.0.0.1',
        port: 8081, // cors: true,    // host: 'local.dev',    // https: true,
    },
});