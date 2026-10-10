const fs = require('fs');
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
  },
  // wdio exits 0 when nothing ran: a SIGINT before any worker starts (e.g.
  // during the chromedriver download) ends with no failures, so a test run
  // that tested nothing reported success. Fail unless every spec file
  // finished (any number, when --spec picks files).
  onComplete(exitCode, config, capabilities, results) {
    const picked = process.argv.some((a) => a === '--spec' || a.startsWith('--spec='));
    const expected = picked ? 1 : fs.readdirSync(path.join(__dirname, 'components'))
      .filter((f) => f.endsWith('.test.js')).length;
    if (results.finished < expected) {
      const message = `only ${results.finished} of ${expected} spec files finished`;
      console.error(`\nwdio.conf.js: ${message}; failing the run`);
      throw new Error(message);
    }
  }
};
