import RendererFactory from './renderer-factory';

export function registerGlobal(window) {
  window.MobiledocTextRenderer = RendererFactory;
}

export default RendererFactory;
