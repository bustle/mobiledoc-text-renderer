import Renderer from './text-renderer';

export function registerGlobal(window) {
  window.MobiledocTextRenderer = Renderer;
}

export default Renderer;
