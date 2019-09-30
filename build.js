const fs = require("fs");
const path = require("path");
const esprima = require("esprima");
const esmangle = require("esmangle");
const escodegen = require("escodegen");
const estraverse = require("estraverse");

const jsFilePath = path.resolve(__dirname, "./code.js");
const context = path.resolve(__dirname, '../');
const pathResolve = (data) => path.resolve(context, data);
// const isCoreModule = (moduleName) => {
//   // 核心模块被定义在node源码lib文件夹下
//   let modules = [
//     'assert',
//     'async_hooks',
//     'buffer',
//     'child_process',
//     'cluster',
//     'console',
//     'constants',
//     'crypto',
//     'dgram',
//     'dns',
//     'domain',
//     'events',
//     'fs',
//     'http',
//     'http2',
//     'https',
//     'inspector',
//     'module',
//     'net',
//     'os',
//     'path',
//     'perf_hooks',
//     'process',
//     'punycode',
//     'querystring',
//     'readline',
//     'repl',
//     'stream',
//     'string_decoder',
//     'sys',
//     'timers',
//     'tls',
//     'trace_events',
//     'tty',
//     'url',
//     'util',
//     'v8',
//     'vm',
//     'worker_threads',
//     'zlib'
//   ];
//   return modules.indexOf(moduleName) !== -1;
// };

const CHAR_FORWARD_SLASH = 47; // /
const load_index = (modulePath) => {
  modulePath = path.resolve(modulePath, 'index.js');
  fs.exists(modulePath, function(exists) {
    if (exists) {
      let stat = fs.lstatSync(modulePath);
      if (!stat.isDirectory()) {
        console.log(`file: ${modulePath}`)
      }
    } else {
      console.log("not found")
    }
  });
}
const load_as_file = (modulePath) => {
  console.log(`file: ${modulePath}`)
}
const load_as_directory = (modulePath) => {
  load_index(modulePath)
}
const load_node_modules = (modulePath) => {
  
}
const node_modules_paths = () => {

}

fs.readFile(jsFilePath, "utf-8", function(error, data) {
  if (error) return console.log(error.message);
  var ast = esprima.parse(data);
  var modules = [];
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if (node.type === 'CallExpression' && node.callee.name === 'require' && node.callee.type === 'Identifier') {
        const requireArguments = node.arguments[0]
        modules.push(requireArguments.value)
      }
    }
  });

  // https://nodejs.org/api/modules.html#modules_accessing_the_main_module
  modules.forEach((moduleName) => {

    if (moduleName.charCodeAt(0) === CHAR_FORWARD_SLASH) {
      console.log(moduleName)
      return
    }

    if (moduleName.slice(0, 2) === './' || moduleName.slice(0, 3) === '../') {
      moduleName = path.resolve(__dirname, moduleName);
      fs.exists(moduleName, function(exists) {
        if (exists) {
          let stat = fs.lstatSync(moduleName);
          if (stat.isDirectory()) {
            load_as_directory(moduleName)
          } else {
            load_as_file(moduleName)
          }
        } else {
          console.log("not found")
        }
      });
      return
    }

    load_node_modules(moduleName)
    console.log("not found")
  });

});
