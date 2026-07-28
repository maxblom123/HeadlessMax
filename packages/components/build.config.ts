import { defineBuildConfig } from 'unbuild'
import vue from '@vitejs/plugin-vue'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  externals: ['vue', 'reka-ui'],
  rollup: {
    emitCJS: false
  },
  hooks: {
    'rollup:options'(_ctx, options) {
      options.plugins = options.plugins ?? []
      options.plugins.push(vue())
    }
  }
})
