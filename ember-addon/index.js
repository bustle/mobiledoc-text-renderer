var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'mobiledoc-text-renderer',
  treeForVendor: function() {
    var files = new Funnel(__dirname + '/../dist/', {
      files: [
        'global/mobiledoc-text-renderer.js'
      ],
      destDir: 'mobiledoc-text-renderer'
    });
    return files;
  },
  included: function(app) {
    app.import('vendor/mobiledoc-text-renderer/global/mobiledoc-text-renderer.js');
  }
};
