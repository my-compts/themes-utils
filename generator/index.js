module.exports = (api, opts, rootOptions) => {
  const utils = require('./utils')(api)
  //sass-resources-loader 用于解决scss变量全局使用
  api.extendPackage({
    devDependencies: {
      "sass-resources-loader": "^2.1.1"
    }
  })

  // api.injectImports(utils.getMain(), `import './test/test.js'`)
  api.injectImports(utils.getFile('src/main.js'), `import './utils/themeControl/variables/resetCompt.scss'`)
  api.injectImports(utils.getFile('src/main.js'), `import './utils/themeControl/tools/mainMixin.js'`)
  api.injectImports(utils.getFile('src/plugins/store/store.js'), `import ToolThemeMgt from './modules/ToolThemeMgt.js'`)
  
  api.render({
    './src/utils/themeControl/tools/ThemeObject.js': './templates/src/tools/ThemeObject.js',
    './src/utils/themeControl/tools/themeMixin.js': './templates/src/tools/themeMixin.js',
    './src/utils/themeControl/tools/mainMixin.js': './templates/src/tools/mainMixin.js',
    './src/utils/themeControl/tools/Color.js': './templates/src/tools/Color.js',
    './src/plugins/store/modules/ToolThemeMgt.js': './templates/src/tools/ToolThemeMgt.js',
    './src/utils/themeControl/ThemeControl.vue': './templates/src/ThemeControl.vue'
  })

  api.render({
    './src/utils/themeControl/variables/toolThemes.scss': './templates/src/variables/toolThemes.scss',
    './src/utils/themeControl/variables/toolVariables.scss': './templates/src/variables/toolVariables.scss',
    './src/utils/themeControl/variables/resetCompt.scss': './templates/src/variables/resetCompt.scss',
    './src/utils/themeControl/variables/toolThemes.json': './templates/src/variables/toolThemes.json',
    './public/theme/index.css': './templates/src/assets/index.css'
  })

  api.onCreateComplete(() => {
    // utils.updateFileConfig('vue.config.js')
  })
}
