const Rule = require('ember-template-lint').Rule;

module.exports = class extends Rule {
  visitor() {
    function print(node) {
      this.log({
        message: 'Found unless/else',
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
    }
    return {
      BlockStatement(node) {
        node.path.type === 'PathExpression' &&
          node.path.original === 'unless' &&
          node.inverse &&
          print.call(this, node);
      },
    };
  }
};
