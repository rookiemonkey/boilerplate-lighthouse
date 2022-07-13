const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const flags = require('../config/flags');
const options = require('../config/options');
const log = console.log;

/**
 * !main function
 * @param {*} url 
 */

module.exports = async function audit(url, finalPath, summaryPath) {

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  flags.port = chrome.port;
  
  const runnerResult = await lighthouse(url, flags, options);

  // append the url&scores of each lighthouse test category to the created summary.csv
  const categories = Object.keys(runnerResult.lhr.categories)
  let scores = `${url},`

  categories.forEach((category, index) => {
    const score = runnerResult.lhr.categories[category].score * 100
    index === categories.length - 1 ? scores += `${score}` : scores += `${score},`
  })

  await fs.appendFileSync(summaryPath, scores)

  // generate the HTML report
  await fs.writeFileSync(path.join(`${finalPath}.html`), runnerResult.report);

  log('DONE ✓ ' + chalk.yellow(runnerResult.lhr.finalUrl));
  await chrome.kill();

};