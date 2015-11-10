/**
 * runtime Text renderer
 * renders a mobiledoc to Text
 *
 * input: mobiledoc
 * output: Text (string)
 */

const LINE_BREAK = '\n';
const DEFAULT_CARD = {
  text: {
    setup() {
      return '';
    }
  }
};

export default class TextRenderer {
  /**
   * @param mobiledoc
   * @param {Object} cardsHash
   * @return String
   */
  render({version, sections: sectionData}, cards={}) {
    const [, sections] = sectionData;
    this.buffer = [];
    this.cards = cards;

    sections.forEach(section => this.buffer.push(this.renderSection(section)));

    return this.buffer.join(LINE_BREAK);
  }

  renderSection(section) {
    const [type] = section;
    switch (type) {
      case 1: // markup section
        return  this.renderMarkupSection(section);
      case 2: // image section
        return this.renderImageSection(section);
      case 3: // list section
        return this.renderListSection(section);
      case 10: // card section
        return this.renderCardSection(section);
      default:
        throw new Error('Unimplemented renderer for type ' + type);
    }
  }

  renderImageSection() {
    return '';
  }

  renderListSection([type, tagName, items]) {
    return items.map(
      li => this.renderListItem(li)
    ).join(LINE_BREAK);
  }

  renderListItem(markers) {
    return this.renderMarkers(markers);
  }

  renderCardSection([type, name, payload]) {
    let str = '';
    let card = this.cards[name] || DEFAULT_CARD;

    let options = {},
        env = {};
    return card.text.setup(str, options, env, payload);
  }

  renderMarkupSection([type, tagName, markers]) {
    return this.renderMarkers(markers);
  }

  renderMarkers(markers) {
    let str = '';
    markers.forEach(m => {
      let [, , text] = m;
      str += text;
    });
    return str;
  }
}
