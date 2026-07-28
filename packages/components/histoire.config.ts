import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [HstVue()],
  outDir: './histoire-dist',
  vite: {
    plugins: [vue()]
  }
})
