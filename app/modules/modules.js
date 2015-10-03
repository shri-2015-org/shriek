// var pathModules = '../../node_modules';
// var normalizedPath = require('path').join(__dirname, pathModules);

// var shriekModules = require('fs').readdirSync(normalizedPath)
//   .filter(function (file) {
//     return /shriek\-.*/g.test(file);
//   })
//   .map(function (file) {
//     return require(file);
// });

module.exports = shriekModules = [
  require('shriek-markdown'),
  require('shriek-emoji')
];
