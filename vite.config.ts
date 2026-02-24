import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path";

// 排除测试文件的插件
const excludeTestFilesPlugin = {
  name: 'exclude-test-files',
  resolveId(id: string) {
    // 在构建时排除 .test.ts 和 .test.tsx 文件
    if (id.includes('.test.ts') || id.includes('.test.tsx')) {
      return { id: '', external: true }
    }
    return null
  }
}
// https://vite.dev/config/
const root = process.cwd();
export default defineConfig({
  root,
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  plugins: [vue(),
  excludeTestFilesPlugin,
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  ],
  server: {
    host: "0.0.0.0",
    port: 8848,
    open: true,
    cors: true,
    // Load proxy configuration from .env.development
    proxy: {
      '/api': {
        target: 'http://192.168.100.70:81/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: { overlay: false }
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
    // minify: "terser",
    // terserOptions: {
    // 	compress: {
    // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
    // 		drop_debugger: true
    // 	}
    // },
    sourcemap: false,
    // 禁用 gzip 压缩大小报告，可略微减少打包时间
    reportCompressedSize: false,
    // 规定触发警告的 chunk 大小
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Static resource classification and packaging
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  }
})
