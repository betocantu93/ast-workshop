const fs = require('fs');
const globby = require('globby');
const glimmer = require('@glimmer/syntax');

let tagCounter = new Map();

// find all template files in the `app/` folder
let templatePaths = globby.sync('app/**/*.hbs', {
  cwd: __dirname,
  absolute: true,
});

for (let templatePath of templatePaths) {
  // read the file content
  let template = fs.readFileSync(templatePath, 'utf8');

  let root = glimmer.preprocess(template);

  glimmer.traverse(root, {
    ElementNode(node) {
      let { tag } = node;
      let previousCount = tagCounter.get(tag) || 0;
      tagCounter.set(tag, previousCount + 1);
    },
  });
  // console.log(root);
}

// output the raw results
console.log(tagCounter);
