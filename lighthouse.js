const fs = require('fs');
const source = require('./source.json');
const sleep = require('./helpers/sleep');
const audit = require('./helpers/audit');


/**
 * ! delete/recreate the results folder
 * ! then run lighthouse test
 */

fs.rmdir(source.output, { recursive: true }, async () => {

  try {

    fs.mkdirSync(source.output, 0744);

    for (const url of source.urls) {
      await sleep(source.delay)
      await audit(url)
    }

  }

  catch (e) { console.log(e); process.exit; }

});