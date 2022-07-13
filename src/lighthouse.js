const fsPromise = require('fs/promises');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const source = require('./source.json');
const sleep = require('./helpers/sleep');
const audit = require('./helpers/audit');
const log = console.log;
const outputPath = path.join(__dirname, source.output);
const summaryPath = `${outputPath}/summary.csv`;
const Sitemapper = require('sitemapper');
const sitemap = new Sitemapper();

(async function(){

  try {
    log(chalk.blue.bold("Starting Lighthouse Audit\n"))

    // recreate the output folder
    if (fs.existsSync(outputPath)) await fsPromise.rm(outputPath, { recursive: true })
    await fs.mkdirSync(outputPath, 0744);

    // create the .csv file with the headers
    await fs.writeFileSync(summaryPath, "url, performance, accessibility, best-practices, seo, pwa\n");

    const sitemapName = source.sitemap_url.slice(source.sitemap_url.lastIndexOf('/') + 1)
    const rootUrl = source.sitemap_url.replace(sitemapName, '')
    const { sites } = await sitemap.fetch(source.sitemap_url)

    for (const site of sites) {
      // delay
      await sleep(source.delay)

      // parse the url and split to to form a folders
      const parts = site.replace(rootUrl, '').split('/')

      for (let i = 0; i < parts.length; i++) {
        const directory = path.join(outputPath, parts[i]);

        // create a folder if not existing unless its the last item on the array
        if ((i < parts.length - 1 && !fs.existsSync(directory))) await fs.mkdirSync(directory)

        // if last item thats the html and its should be audited
        if (i === parts.length - 1) await audit(site, path.join(outputPath, site.replace(rootUrl, '')), summaryPath)
      }
    }

    log(chalk.green.bold("\nDone! Please check your browser using the local url below\n"))
  }

  catch (e) { log(e); process.exit; }

})()
