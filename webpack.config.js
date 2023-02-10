const path = require("path")
const extralFile = require('./script-prefix')

module.exports = {
  devServer: {
    port: 7000,
    onBeforeSetupMiddleware: () => {
      extralFile()
    },
    static: {
      directory: path.join(__dirname, 'public'),
    },
  }
}