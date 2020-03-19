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
    ElementNode(node) {
      if(node.tag !== 'MenuItem') return;
      node.tag = 'NewMenuItem';
      let captionAttr = node.attributes.find(it => it.name === '@caption');
      if(captionAttr) {
        node.children = [captionAttr.value]
      }
      node.attributes = node.attributes.filter(it => it.name !== '@caption');
    }
  })

  let newTemplate = recast.print(root);

  // if necessary, write the changes back to the original file
  if (newTemplate !== template) {
    fs.writeFileSync(templatePath, newTemplate, 'utf8')
  }
}
