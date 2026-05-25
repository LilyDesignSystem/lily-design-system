const path = require('path');

exports.config = {
  runner: 'local',
  specs: ['./components/*.test.js'],
  maxInstances: 8,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--no-sandbox', '--disable-gpu']
    }
  }],
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'file://' + path.resolve(__dirname, 'components'),
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
