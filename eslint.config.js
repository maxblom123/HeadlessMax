import vue from 'eslint-plugin-vue'
import vueTsConfig from '@vue/eslint-config-typescript'

export default [
  ...vue.configs['flat/recommended'],
  ...vueTsConfig(),
  {
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error'
    }
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**']
  }
]