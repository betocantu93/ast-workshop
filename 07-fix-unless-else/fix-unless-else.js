const fs = require('fs');
const globby = require('globby');
const recast = require('ember-template-recast');

// find all template files in the `app/` folder
let templatePaths = globby.sync('app/**/*.hbs', {
  cwd: __dirname,
  absolute: true,
});

for (let templatePath of templatePaths) {
  // read the file content
  let template = fs.readFileSync(templatePath, 'utf8');

  let root = recast.parse(template);

  recast.traverse(root, {
    BlockStatement(node) {
      let { path } = node;
      if (path.type === 'PathExpression' && path.original === 'unless' && node.inverse) {
        let { program, inverse } = node;
        let programBody = program.body;
        let inverseBody = inverse.body;

        // swap `program` and `inverse` blocks
        node.program.body = inverseBody;
        node.inverse.body = programBody;

        // change the block statement from `unless` to `if`
        node.path.original = 'if';
      }
    },
  });

  // TODO write your implementation here

  let newTemplate = recast.print(root);

  // if necessary, write the changes back to the original file
  if (newTemplate !== template) {
    fs.writeFileSync(templatePath, newTemplate, 'utf8');
  }
}
