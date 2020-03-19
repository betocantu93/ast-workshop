const fs = require('fs');
const globby = require('globby');
const glimmer = require('@glimmer/syntax');

// find all template files in the `app/` folder
let templatePaths = globby.sync('app/**/*.hbs', {
  cwd: __dirname,
  absolute: true,
});

function printLoc(loc) {
  return `${loc.start.line}:${loc.start.column}`;
}

for (let templatePath of templatePaths) {
  // read the file content
  let template = fs.readFileSync(templatePath, 'utf8');

  let root = glimmer.preprocess(template);

  glimmer.traverse(root, {
    BlockStatement(node) {
      node.path.type === 'PathExpression' &&
        node.path.original === 'unless' &&
        node.inverse &&
        console.log(`Found unless/else in ${templatePath}:${printLoc(node.path.loc)}`);
    },
  });
  // TODO write your implementation here
}
