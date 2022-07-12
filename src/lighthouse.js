const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const source = require('./source.json');
const sleep = require('./helpers/sleep');
const audit = require('./helpers/audit');
const log = console.log;
const outputPath = path.join(__dirname, source.output);

/**
 * ! delete/recreate the results folder
 * ! then run lighthouse test
 */

fs.rm(outputPath, { recursive: true }, async () => {

  try {
    log(chalk.blue.bold("Starting Lighthouse Audit\n"))

    fs.mkdirSync(outputPath, 0744);

    for (const url of source.urls) {
      await sleep(source.delay)
      await audit(url)
    }

    log(chalk.green.bold("\nDone! Please check your browser using the local url below\n"))
  }

  catch (e) { log(e); process.exit; }

});