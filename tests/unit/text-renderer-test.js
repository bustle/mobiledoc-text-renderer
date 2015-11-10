/* global QUnit */

const { test } = QUnit;

import Renderer from 'mobiledoc-text-renderer';
const MOBILEDOC_VERSION = '0.2.0';

let renderer;
QUnit.module('Unit: Mobiledoc Text Renderer', {
  beforeEach() {
    renderer = new Renderer();
  }
});

test('it exists', (assert) => {
  assert.ok(Renderer, 'class exists');
  assert.ok(renderer, 'instance exists');
});

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      []  // sections
    ]
  };
  let rendered = renderer.render(mobiledoc);

  assert.ok(rendered, 'renders output');
  assert.equal(rendered, '<div></div>', 'output is empty');
});

test('renders a mobiledoc without markers', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [1, 'P', [
          [[], 0, 'hello world']]
        ]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered,
               '<div><p>hello world</p></div>');
});

test('renders a mobiledoc with simple (no attributes) marker', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['B'],
      ],
      [        // sections
        [1, 'P', [
          [[0], 1, 'hello world']]
        ]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><b>hello world</b></p></div>');
});

test('renders a mobiledoc with complex (has attributes) marker', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['A', ['href', 'http://google.com']],
      ],
      [        // sections
        [1, 'P', [
            [[0], 1, 'hello world']
        ]]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><a href="http://google.com">hello world</a></p></div>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['B'],
        ['I']
      ],
      [        // sections
        [1, 'P', [
          [[0], 0, 'hello '], // b
          [[1], 0, 'brave '], // b+i
          [[], 1, 'new '], // close i
          [[], 1, 'world'] // close b
        ]]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p><b>hello <i>brave new </i>world</b></p></div>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let url = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [2, url]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, `<div><img src="${url}"></div>`);
});

test('renders a mobiledoc with card section and src in payload to image', (assert) => {
  assert.expect(1);
  let cardName = 'title-card';
  let payload = {
    src: 'bob.gif'
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><img src="bob.gif"></div>');
});

test('renders a mobiledoc with card section and no src to nothing', (assert) => {
  assert.expect(1);
  let cardName = 'title-card';
  let payload = {
    name: 'bob'
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, '<div><p></p></div>');
});

test('renders a mobiledoc with card section that has been provided', (assert) => {
  assert.expect(3);
  let cardName = 'title-card';
  let payload = {
    name: 'bob'
  };
  let titleCard = {
    name: cardName,
    text: {
      setup(buffer, options, env, setupPayload) {
        assert.deepEqual(buffer, []);
        assert.deepEqual(payload, setupPayload);
        buffer.push('Howdy ');
        buffer.push('friend');
      }
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc, {
    'title-card': titleCard
  });
  assert.equal(rendered, '<div><div>Howdy friend</div></div>');
});

test('renders a mobiledoc with default image section', (assert) => {
  assert.expect(1);
  let cardName = 'image';
  let payload = {
    src: 'example.org/foo.jpg'
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);

  assert.equal(rendered, '<div><div><img src="example.org/foo.jpg"></div></div>');
});

test('render mobiledoc with list section and list items', (assert) => {
  const mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [3, 'ul', [
          [[[], 0, 'first item']],
          [[[], 0, 'second item']]
        ]]
      ]
    ]
  };
  const rendered = renderer.render(mobiledoc);
  
  assert.equal(rendered,
               '<div><ul><li>first item</li><li>second item</li></ul></div>');
});
