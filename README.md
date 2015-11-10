## Mobiledoc Text Renderer [![Build Status](https://travis-ci.org/bustlelabs/mobiledoc-text-renderer.svg?branch=v0.1.0)](https://travis-ci.org/bustlelabs/mobiledoc-text-renderer)

This is an Text renderer for the [Mobiledoc](https://github.com/bustlelabs/content-kit-editor/blob/master/MOBILEDOC.md) format used
by the [Content-Kit Editor](https://github.com/bustlelabs/content-kit-editor).

The renderer is a small library intended for use in servers that are building
Text documents. It may be of limited use inside browsers as well.

### Usage

```
var mobiledoc = {
  version: "0.1",
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
var renderer = new TextRenderer();
var cards = {};
var rendered = renderer.render(mobiledoc, cards);
document.getElementById('output').appendChild(rendered);
// renders <div><p><b>hello world</b></b></div>
// into 'output' element
```

### Tests

 * `npm test`

### Releasing

* `npm version patch` or `minor` or `major`
* `npm run build`
* `git push bustle --tags`
* `npm publish`
