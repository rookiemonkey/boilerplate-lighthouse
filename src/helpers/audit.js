const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { output } = require('../source.json');
const flags = require('../config/flags');
const options = require('../config/options');
const log = console.log;

/**
 * !main function
 * @param {*} url 
 */


module.exports = async function audit(url) {

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  flags.port = chrome.port;
  const runnerResult = await lighthouse(url, flags, options);

  // .report is the HTML report as a string
  const reportHtml = runnerResult.report;
  const fileName = url.substring(url.lastIndexOf('/') + 1)
  fs.writeFileSync(path.join(__dirname, `../${output}/${fileName}.html`), reportHtml);

  // .lhr is the Lighthouse Result as a JS object
  log('DONE ✓ ' + chalk.yellow(runnerResult.lhr.finalUrl));
  await chrome.kill();

};