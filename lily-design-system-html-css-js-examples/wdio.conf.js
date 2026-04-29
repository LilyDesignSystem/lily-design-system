const path = require('path');

exports.config = {
  runner: 'local',
  specs: ['./tests/*.test.js'],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--no-sandbox', '--disable-gpu']
    }
  }],
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'file://' + path.resolve(__dirname, 'pages'),
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
