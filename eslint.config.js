import vue from 'eslint-plugin-vue'
import vueTsConfig from '@vue/eslint-config-typescript'

export default [
  ...vue.configs['flat/recommended'],
  ...vueTsConfig(),
  {
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'vue/multi-word-component-names': [
        'error',
        { ignores: ['Select', 'Dialog', 'Tabs'] }
      ],
      'vue/require-default-prop': 'off'
    }
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**']
  }
]