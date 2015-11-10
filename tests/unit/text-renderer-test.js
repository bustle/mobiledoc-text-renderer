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

  assert.equal(rendered, '', 'output is empty');
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
               'hello world');
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
  assert.equal(rendered, 'hello world');
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
  assert.equal(rendered, 'hello world');
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
  assert.equal(rendered, 'hello brave new world');
});

test('renders a mobiledoc with multiple sections', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],        // markers
      [        // sections
        [1, 'P', [
          [[], 0, 'first section'],
        ]],
        [1, 'P', [
          [[], 0, 'second section']
        ]]
      ]
    ]
  };

  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered, ['first section', 'second section'].join('\n'));
});

// FIXME ??
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
  assert.equal(rendered, '', 'card section is empty');
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
  assert.equal(rendered, '', 'card section is empty');
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
  assert.equal(rendered, '', 'card section with no src is empty');
});

test('renders a mobiledoc with card section that has been provided', (assert) => {
  let cardName = 'title-card';
  let payload = {
    name: 'bob'
  };
  let titleCard = {
    name: cardName,
    text: {
      setup(buffer, options, env, payload) {
        return `Howdy ${payload.name}`;
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
  assert.equal(rendered, 'Howdy bob');
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

  assert.equal(rendered, '', 'empty for image sections');
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
  
  assert.equal(rendered, ['first item','second item'].join('\n'));
});
