const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { output } = require('../source.json');

/**
 * !main function
 * @param {*} url 
 */


module.exports = async function audit(url) {

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { output: 'html', port: chrome.port };
  const runnerResult = await lighthouse(url.url, options);

  // .report is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync(path.join(__dirname, `.${output}/${url.file_name}`), reportHtml);

  // .lhr is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  await chrome.kill();

};