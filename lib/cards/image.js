const ImageCard = {
  name: 'image',
  text: {
    setup(buffer, options, env, payload) {
      if (payload.src) {
        buffer.push(`<img src="${payload.src}">`);
      }
    }
  }
};

export default ImageCard;
