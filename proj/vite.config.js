import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     '@jridgewell/gen-mapping': '@jridgewell/gen-mapping/src/gen-mapping.ts',
  //   },
  // },
})
