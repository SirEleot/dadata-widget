const path = require('path');

module.exports = {
  entry: './scripts/dadata-widget.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dadata-widget.bandle.js'
  }
};