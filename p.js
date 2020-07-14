const fs = require('fs');
const { Parser, DomHandler, DomUtils } = require('htmlparser2');
const compiler = require('vue-template-compiler');
// const { manipulation } = require('domutils');

function parseTemplate(text) {
  return new Promise((resolve, reject) => {
    const handler = new DomHandler((error, dom)=>{
      if (error) {
        reject(error);
      } else {
        resolve(dom);
      }
    });
    const parser = new Parser(handler);
    parser.write(text);
    parser.end();
  });
}

function astToString (ast) {
  let str = '';
  ast.forEach(item => {
    if (item.type === 'text') {
      str += item.data;
    } else if (item.type === 'tag') {
      str += '<' + item.name;
      if (item.attribs) {
        Object.keys(item.attribs).forEach(attr => {
          str += ` ${attr}="${item.attribs[attr]}"`;
        });
      }
      str += '>';
      if (item.children && item.children.length) {
        str += astToString(item.children);
      }
      if (item.name !== 'img') {
        str += `</${item.name}>`;
      }
    }
  });
  return str;
}

const attrConverterConfig = {
  'v-show': {
    key: 'c-show',
    value: function(str) {
      return `{{${str}}}`
    }
  },
  'v-for': {
    handle: function(node, value) {
      console.log(node)
      const forList = value.split(' in ');
      const [item, index] = forList[0].replace(/\(/, '').replace(/\)/, '').split(',');
      const obj = forList[1];
      const start = {
        type: 'text',
        data: `\n{{#list ${obj.trim()} as ${item.trim()} by ${index.trim()}}}\n`
      }
      const end = {
        type: 'text',
        data: '\n{{/list}}\n'
      }
      DomUtils.prepend(node, start)
      DomUtils.append(node, end)
      return ''
    }
  },
  'v-if': {
    handle: function(node, value) {
      const start = {
        type: 'text',
        data: `\n{{#if ${value}}}\n`
      }
      DomUtils.prepend(node, start)
      return ''
    }
  },
  'v-else': {
    handle: function(node, value) {
      const start = {
        type: 'text',
        data: `\n{{#else}}\n`
      }
      const end = {
        type: 'text',
        data: `\n{{/if}}\n`
      }
      DomUtils.prepend(node, start)
      DomUtils.append(node, end)
      return ''
    }
  }
}

const templateConverter = function(ast) {

  for (let i = 0; i < ast.length; i++) {
    let node = ast[i]

    if (node.type === 'tag') {
      let attrs = {}
      for (let attrName in node.attribs) {
        let target;
        if (/^:.*$/.test(attrName)) {
          const name = attrName.slice(1)
          if (name !== 'key') {
            const [ value, filterExp ] = node.attribs[attrName].split('|');
            if (filterExp) {
              const filterName = filterExp.match(/([^\(]+)/)[0];
              const filterParam = filterExp.slice(filterName.length + 1, filterExp.length - 1)
              attrs[name] = `{{${value} | ${filterName}:${filterParam}}}`
            } else {
              attrs[name] = `{{${value}}}`
            }
          }
          continue;
        } else {
          target = attrConverterConfig[attrName]
        }

        if (target) {
          if (target['key']) {
            attrs[target['key']] = target['value'] ? target['value'](node.attribs[attrName]) : node.attribs[attrName]
          } else {
            target['handle'](node, node.attribs[attrName])
          }
        } else {
          attrs[attrName] = node.attribs[attrName]
        }
      }
      node.attribs = attrs
    }

    if(node.children){
      templateConverter(node.children)
    }
  }

  return ast
}

// const code = fs.readFileSync('./test.vue', 'utf-8');

// parse(code).then(function(ast) {
//   console.log(ast);
// })

const typesHandler = {
  template: function({ type, content }) {
    return parseTemplate(content).then((ast) => {
      let convertedTemplate = templateConverter(ast)
      templateConvertedString = astToString(convertedTemplate)
      fs.writeFileSync('./cube.tpl', templateConvertedString);
    })
  },
  script: function({ type, content }) {
    // console.log(content)
  },
  styles: function(styles) {
    const outputStyle = styles.reduce((total, { content }) => {
      return total += content;
    }, '');
    // console.log(outputStyle)
  }
}

const convert = function(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  fileHandle(code, filePath)
}
const fileHandle = function(code, filePath) {
  const output = compiler.parseComponent(code);
  Object.keys(output).filter(typeName => {
    if (typeName in typesHandler) {
      return typesHandler[typeName](output[typeName])
    }
  })
}

convert('./test.vue')
