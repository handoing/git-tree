const espree = require("espree");
const estraverse = require("estraverse");
const escodegen = require("escodegen");

module.exports = function (source) {
  this.cacheable();

  var cssReg = /<(style)(?:[^>]*)?>([\s\S]*?)(?:<\/\1>[^\"\']|<\/\1>$)/ig;
  var jsReg = /<(script)(?:[^>]*)?>([\s\S]*?)(?:<\/\1>[^\"\']|<\/\1>$)/ig;
  var tplReg = /<(template)(?:[^>]*)?>([\s\S]*?)(?:<\/\1>[^\"\']|<\/\1>$)/ig;
  var cssContent = cssReg.exec(source);
  var jsContent = jsReg.exec(source);
  var tplContent = tplReg.exec(source);
  const ast = espree.parse(jsContent[2], {
    ecmaVersion: 2015,
    sourceType: "module"
  });
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if (node.type == 'ObjectExpression' && parent.type == 'ExportDefaultDeclaration')
        node.properties.push({
          "type": "Property",
          "key": {
            "type": "Identifier",
            "name": "template"
          },
          "value": {
            "type": "Literal",
            "value": tplContent[2]
          },
          "kind": "init"
        })
    }
  });
  let cssString = `
    var style = document.createElement("style");
    style.type = "text/css";
    try{
    　　style.appendChild(document.createTextNode(\`${cssContent[2]}\`));
    }catch(e){
    　　style.styleSheet.cssText = \`${cssContent[2]}\`;
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  `
  let jsString = escodegen.generate(ast);
  return cssString + jsString;

}
