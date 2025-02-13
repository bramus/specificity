const Benchmark = require('./../node_modules/benchmark/benchmark.js');
const Specificity = require('./../dist/index.cjs').default;
const parse = require('./../node_modules/css-tree/cjs/parser/parse-selector.cjs');

const selector = 'header:where(#top) nav li:nth-child(2n)';
const ast = parse(selector, {
    context: 'selectorList',
});

const suite = new Benchmark.Suite('Benchmarking @bramus/specificity');
suite
.add('Specificity.calculate(string)', function() {
    Specificity.calculate(selector);
})
.add('Specificity.calculate(ast) - using SelectorList', function() {
    Specificity.calculate(ast);
})
.add('Specificity.calculate(ast) - using Selector', function() {
    Specificity.calculate(ast.children.first);
})
.add('Specificity.calculateForAST(ast)', function() {
    Specificity.calculateForAST(ast.children.first);
})
.on('cycle', event => {
  console.log(String(event.target));
})
.run({ async: false });
