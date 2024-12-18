import path, { resolve } from 'path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
export default defineConfig({
  plugins: [
    electron({
      main: { entry: './src/main/index.ts' },
      preload: {
        input: path.join(__dirname, '/src/preload/index.ts')
      },
      renderer: {}
    })
  ],
  esbuild: {
    // ���������ã���֧�ֶ�̬����
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'preact';`
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/renderer')
    }
  },
  base: '/'
})
