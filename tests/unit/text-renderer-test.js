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

test('throws if given card with invalid type', (assert) => {
  let card = {
    name: 'bad',
    type: 'other',
    render() {}
  };
  assert.throws(
    () => { new Renderer({cards: [card]}); }, // jshint ignore:line
    /Card "bad" must be type "text"/
  );
});

test('throws if given card without render', (assert) => {
  let card = {
    name: 'bad',
    type: 'text',
    render: undefined
  };
  assert.throws(
    () => { new Renderer({cards: [card]}); }, // jshint ignore:line
    /Card "bad" must define.*render/
  );
});

test('card can register teardown callback', (assert) => {
  let didTeardown;
  let card = {
    name: 'ok',
    type: 'text',
    render({env}) {
      env.onTeardown(() => didTeardown = true);
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [
        [10, card.name]
      ]
    ]
  };
  renderer = new Renderer({cards: [card]});
  let { teardown } = renderer.render(mobiledoc);

  assert.ok(!didTeardown, 'precond - no teardown');

  teardown();

  assert.ok(didTeardown, 'teardown callback called');
});

test('rendering unknown card does nothing if no unknownCardHandler registered', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [
        [10, 'missing-card']
      ]
    ]
  };
  renderer = new Renderer({cards: [], unknownCardHandler: undefined});
  let { result } = renderer.render(mobiledoc);

  assert.equal(result, '', 'empty result');
});

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      []  // sections
    ]
  };
  let {result: rendered} = renderer.render(mobiledoc);

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
  let {result: rendered} = renderer.render(mobiledoc);
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
  let {result: rendered} = renderer.render(mobiledoc);
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
  let {result: rendered} = renderer.render(mobiledoc);
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
  let {result: rendered} = renderer.render(mobiledoc);
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

  let {result: rendered} = renderer.render(mobiledoc);
  assert.equal(rendered, ['first section', 'second section'].join('\n'));
});

test('built-in image-card renders as empty string', (assert) => {
  assert.expect(1);
  let cardName = 'image-card';
  let payload = { src: 'bob.gif' };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let {result: rendered} = renderer.render(mobiledoc);
  assert.equal(rendered, '', 'card section is empty');
});

test('renders a mobiledoc with card', (assert) => {
  let cardName = 'title-card';
  let card = {
    name: cardName,
    type: 'text',
    render() {
      return 'Hello';
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName]
      ]
    ]
  };
  renderer = new Renderer({cards: [card]});
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, 'Hello');
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
  let { result: rendered } = renderer.render(mobiledoc);
  
  assert.equal(rendered, ['first item','second item'].join('\n'));
});
