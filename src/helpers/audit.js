import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import flags from '../config/flags.js';
import options from '../config/options.js';
const log = console.log;

/**
 * !main function
 * @param {*} url 
 */

export default async function audit(url, finalPath, summaryPath, progress, count) {

  try {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--disable-gpu", "--no-sandbox"],
      chromePath: "/usr/bin/google-chrome"
    });
    flags.port = chrome.port;

    const runnerResult = await lighthouse(url, flags, options);

    // append the url&scores of each lighthouse test category to the created summary.csv
    const categories = Object.keys(runnerResult.lhr.categories)
    let scores = `${url},`

    categories.forEach((category, index) => {
      const score = runnerResult.lhr.categories[category].score * 100
      index === categories.length - 1 ? scores += `${score}\n` : scores += `${score},`
    })

    await fs.appendFileSync(summaryPath, scores)

    // generate the HTML report
    await fs.writeFileSync(path.join(`${finalPath}.html`), runnerResult.report);

    log(`[${progress} of ${count}] DONE ✓ ` + chalk.yellow(runnerResult.lhr.finalUrl));
    await chrome.kill();
  }

  catch(e){
    console.log("ERROR => ", e)
  }

};