/* global QUnit */

import Renderer from 'mobiledoc-text-renderer';
import {
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  CARD_SECTION_TYPE,
  IMAGE_SECTION_TYPE
} from 'mobiledoc-text-renderer/utils/section-types';

const { test, module } = QUnit;
const MOBILEDOC_VERSION = '0.2.0';

let renderer;
module('Unit: Mobiledoc Text Renderer - 0.2', {
  beforeEach() {
    renderer = new Renderer();
  }
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
        [MARKUP_SECTION_TYPE, 'P', [
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
        [MARKUP_SECTION_TYPE, 'P', [
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
        [MARKUP_SECTION_TYPE, 'P', [
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
        [MARKUP_SECTION_TYPE, 'P', [
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

test('renders a mobiledoc with image section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [IMAGE_SECTION_TYPE, 'imageUrl']
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, '', 'image section is empty string');
});

test('renders a mobiledoc with built-in image card (as empty string)', (assert) => {
  assert.expect(1);
  let cardName = 'image-card';
  let payload = { src: 'bob.gif' };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [CARD_SECTION_TYPE, cardName, payload]
      ]
    ]
  };
  let {result: rendered} = renderer.render(mobiledoc);
  assert.equal(rendered, '', 'card section is empty');
});

test('render mobiledoc with list section and list items', (assert) => {
  const mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [LIST_SECTION_TYPE, 'ul', [
          [[[], 0, 'first item']],
          [[[], 0, 'second item']]
        ]]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);

  assert.equal(rendered, ['first item','second item'].join('\n'));
});

test('renders a mobiledoc with card section', (assert) => {
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
        [CARD_SECTION_TYPE, cardName]
      ]
    ]
  };
  renderer = new Renderer({cards: [card]});
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, 'Hello');
});

test('throws when given card with invalid type', (assert) => {
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

test('throws when given card without `render`', (assert) => {
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

test('throws if card render returns invalid result', (assert) => {
  let card = {
    name: 'bad',
    type: 'text',
    render() {
      return [];
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [[CARD_SECTION_TYPE, card.name]]  // sections
    ]
  };
  renderer = new Renderer({cards: [card]});
  assert.throws(
    () => renderer.render(mobiledoc),
    /Card "bad" must render text/
  );
});

test('card may render nothing', (assert) => {
  let card = {
    name: 'ok',
    type: 'text',
    render() {}
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, card.name]
      ]
    ]
  };

  renderer = new Renderer({cards:[card]});
  renderer.render(mobiledoc);

  assert.ok(true, 'No error thrown');
});

test('rendering nested mobiledocs in cards', (assert) => {
  let cards = [{
    name: 'nested-card',
    type: 'text',
    render({payload}) {
      let {result: rendered} = renderer.render(payload.mobiledoc);
      return rendered;
    }
  }];

  let innerMobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, 'hello world']]
        ]
      ]
    ]
  };

  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [CARD_SECTION_TYPE, 'nested-card', {mobiledoc: innerMobiledoc}]
      ]
    ]
  };

  let renderer = new Renderer({cards});
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(rendered, 'hello world');
});

test('rendering unknown card without unknownCardHandler does nothing', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [
        [CARD_SECTION_TYPE, 'missing-card']
      ]
    ]
  };
  renderer = new Renderer({cards: [], unknownCardHandler: undefined});
  let { result } = renderer.render(mobiledoc);

  assert.equal(result, '', 'empty result');
});

test('rendering unknown card uses unknownCardHandler', (assert) => {
  assert.expect(5);

  let cardName = 'missing-card';
  let expectedPayload = {};
  let cardOptions = {};
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [CARD_SECTION_TYPE, cardName, expectedPayload]
      ]
    ]
  };
  let unknownCardHandler = ({env, payload, options}) => {
    assert.equal(env.name, cardName, 'correct name');
    assert.ok(!env.isInEditor, 'correct isInEditor');
    assert.ok(!!env.onTeardown, 'onTeardown hook exists');

    assert.deepEqual(payload, expectedPayload, 'correct payload');
    assert.deepEqual(options, cardOptions, 'correct options');
  };
  renderer = new Renderer({cards: [], unknownCardHandler, cardOptions});
  renderer.render(mobiledoc);
});

test('throws if given an object of cards', (assert) => {
  let cards = {};
  assert.throws(
    () => { new Renderer({cards}) }, // jshint ignore: line
    /`cards` must be passed as an array/
  );
});

test('teardown hook calls registered teardown methods', (assert) => {
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
        [CARD_SECTION_TYPE, card.name]
      ]
    ]
  };
  renderer = new Renderer({cards: [card]});
  let { teardown } = renderer.render(mobiledoc);

  assert.ok(!didTeardown, 'precond - no teardown');

  teardown();

  assert.ok(didTeardown, 'teardown callback called');
});

test('throws when given an unexpected mobiledoc version', (assert) => {
  let mobiledoc = {
    version: '0.1.0',
    sections: [
      [], []
    ]
  };
  assert.throws(
    () => renderer.render(mobiledoc),
    /Unexpected Mobiledoc version.*0.1.0/);

  mobiledoc.version = '0.2.1';
  assert.throws(
    () => renderer.render(mobiledoc),
    /Unexpected Mobiledoc version.*0.2.1/);
});

test('renders a mobiledoc with multiple sections', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],        // markers
      [        // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, 'first section'],
        ]],
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, 'second section']
        ]]
      ]
    ]
  };

  let {result: rendered} = renderer.render(mobiledoc);
  assert.equal(rendered, ['first section', 'second section'].join('\n'));
});

test('XSS: unexpected markup and list section tag names are not renderered', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [MARKUP_SECTION_TYPE, 'script', [
          [[], 0, 'alert("markup section XSS")']
        ]],
        [LIST_SECTION_TYPE, 'script', [
          [[[], 0, 'alert("list section XSS")']]
        ]]
      ]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  assert.ok(result.indexOf('script') === -1, 'no script tag rendered');
});

test('XSS: unexpected markup types are not rendered', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [
        ['b'], // valid
        ['em'], // valid
        ['script'] // invalid
      ],
      [
        [MARKUP_SECTION_TYPE, 'p', [
          [[0], 0, 'bold text'],
          [[1,2], 3, 'alert("markup XSS")'],
          [[], 0, 'plain text']
        ]]
      ]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  assert.ok(result.indexOf('script') === -1, 'no script tag rendered');
});
