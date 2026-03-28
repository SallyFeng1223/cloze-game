import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ⚠️ 這裡填入您的 GitHub Repository 名稱
  base: '/cloze-game/',
})
