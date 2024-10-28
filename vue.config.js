const { defineConfig } = require('@vue/cli-service')

//const publicPath = process.env.NODE_ENV === 'production' ? '/rdkit_demo/' : '/'

module.exports = defineConfig({
  transpileDependencies: true,

  // Add the publicPath and outputDir settings
  //publicPath: publicPath,
  //outputDir: 'dist',

  // Add the proxy configuration
  devServer: {
    //port: 8000,
    proxy: {
      '/apps': {
        target: 'http://172.21.1.124:8000/apps',
        changeOrigin: true,
        pathRewrite: {
          '^/apps': ''
        }
      }
    }
  }
})
