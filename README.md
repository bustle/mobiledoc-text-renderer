## Mobiledoc Text Renderer [![Build Status](https://travis-ci.org/bustlelabs/mobiledoc-text-renderer.svg?branch=master)](https://travis-ci.org/bustlelabs/mobiledoc-text-renderer)

This is an Text renderer for the [Mobiledoc](https://github.com/bustlelabs/mobiledoc-kit/blob/master/MOBILEDOC.md) format used
by the [Mobiledoc-kit](https://github.com/bustlelabs/mobiledoc-kit).

The renderer is a small library intended for use in servers that are building
Text documents. It may be of limited use inside browsers as well.

### Usage

```
var mobiledoc = {
  version: "0.2.0",
  sections: [
    [         // markers
      ['B']
    ],
    [         // sections
      [1, 'P', [ // array of markups
        // markup
        [
          [0],          // open markers (by index)
          0,            // close count
          'hello world'
        ]
      ]
    ]
  ]
};
var renderer = new TextRenderer({cards: []});
var rendered = renderer.render(mobiledoc);
console.log(rendered.result); // "hello world"
```

### Tests

 * `npm test`

### Releasing

* `npm version patch` or `minor` or `major`
* `npm run build`
* `git push bustle --tags`
* `npm publish`
