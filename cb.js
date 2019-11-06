const compiler = require('vue-template-compiler');

const posthtml      = require("posthtml")
const postcss       = require("postcss")

const posthtmlScope = require("style-scope/posthtml")
const postcssScope  = require("style-scope/postcss")

const hash = require('hash-sum')

const source = `
<template>
<span>1</span>
</template>
<style scoped>
span {
    color: red;
}
</style>
<script>
export default {
    name: 'demo'
}
</script>
`

const id = "abcd";
const hashId = hash(id + source);
const shortHash = hashId.slice(0, 8);

var sourceMap = compiler.parseComponent(source)
console.log(sourceMap)

const html = sourceMap.template.content;

const css = sourceMap.styles[0].content

postcss([ postcssScope({ rootScope: shortHash, attrPrefix: 'c-' }) ])
    .process(css, {})
    .then((result) => { 
        console.log(result.css)
        var t = `
          (styleContent) {
            var styleNode = document.createElement("style");
            styleNode.setAttribute("type", "text/css");
            if (styleNode.styleSheet) {
              styleNode.styleSheet.cssText = styleContent;
            } else {
              styleNode.appendChild(document.createTextNode(styleContent));
            }
            document.getElementsByTagName("head")[0].appendChild(styleNode);
          }
        `
        console.log('\n;(' + t + ')(' + JSON.stringify(result.css) + ');\n')
    })

posthtml([ posthtmlScope({ rootScope: shortHash, attrPrefix: 'c-' }) ])
    .process(html, {})
    .then((result) => { console.log(result.html) })
