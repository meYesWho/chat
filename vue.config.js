module.exports = {
    publicPath: './',
        devServer: {
          proxy: {
            '/api': {
              target: 'http://104.202.61.194', 
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/api': ''
              }
            }
          }
        }

}