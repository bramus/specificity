# CSS Specificity Calculator

Calculate the Specificity of a given CSS Selector

## Installation

```bash
npm i @bramus/specificity-calculator
```

## Usage / Example

This library comes as an ES Module and exposes a function/algorithm to generate an array of pagination entries.

```js
import { calculate } from '@bramus/specificity-calculator';

const specificity = calculate('.foo :is(.bar, #baz)');
// ~> { a: 1, b: 1, c: 0 }
```

## License

`@bramus/specificity-calculator` is released under the MIT public license. See the enclosed `LICENSE` for details.

## Acknowledgements

The code was sparked by [the online Specificity Calculator created by Kilian Valkhof / Polypane](https://polypane.app/css-specificity-calculator/).

The heavy lifting of doing the actual parsing is done by [CSSTree](https://github.com/csstree/csstree).
