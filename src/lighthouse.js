import fsPromise from 'fs/promises';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import Sitemapper from 'sitemapper';

import source from './source.json' assert { type: "json" };
import sleep from './helpers/sleep.js';
import audit from './helpers/audit.js';

const log = console.log;
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // get the name of the directo
const outputPath = path.join(__dirname, source.output);
const summaryPath = `${outputPath}/summary.csv`;

(async function(){

  try {
    const sitemap = new Sitemapper();

    log(chalk.blue.bold("Starting Lighthouse Audit\n"))

    // recreate the output folder
    if (fs.existsSync(outputPath)) await fsPromise.rm(outputPath, { recursive: true })
    await fs.mkdirSync(outputPath, 0o744);

    // create the .csv file with the headers
    await fs.writeFileSync(summaryPath, "url, performance, accessibility, best-practices, seo, pwa\n");

    const sitemapName = source.sitemap_url.slice(source.sitemap_url.lastIndexOf('/') + 1)
    const rootUrl = source.sitemap_url.replace(sitemapName, '')
    const { sites } = await sitemap.fetch(source.sitemap_url)

    let count = sites.length
    let progress = 1

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
        if (i === parts.length - 1) await audit(site, path.join(outputPath, site.replace(rootUrl, '')), summaryPath, progress, count)
      }

      progress+=1
    }

    log(chalk.green.bold("\nDone! Please check your browser using the local url below\n"))
  }

  catch (e) { log(e); process.exit; }

})()
