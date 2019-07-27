// config-overrides.js
const {
    override,
    useEslintRc,
} = require('customize-cra');

module.exports = {
   webpack: function(config, env) {
    config = useEslintRc()(config);
    // ...add your webpack config
    console.log('config.module', config.module.rules[2].options);

    config.module.rules[2].oneOf[2].options.sourceMaps = true;
    config.module.rules[2].oneOf[2].options.inputSourceMap = true;

    
    return config;
  },
};