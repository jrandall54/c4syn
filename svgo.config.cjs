module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeUnknownsAndDefaults: { keepDataAttrs: true }
        }
      }
    },
    { name: 'removeViewBox', active: false }
  ]
};