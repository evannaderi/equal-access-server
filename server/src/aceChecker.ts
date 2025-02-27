// import ace from '../../ace-engine/dist/ace-node.js';
import type { Report } from "./engine-types/v4/api/IReport";
import type { Issue } from "./engine-types/v4/api/IRule";
// import { JSDOM } from 'jsdom';
// import { Checker } from '../../ace-engine/dist/ace-node.js';
import * as puppeteer from "puppeteer-core";

// Since ace is loaded from a script tag in the js runtime, we need to declare it here
declare var ace: any;
const is_docker = process.env.IS_DOCKER && process.env.IS_DOCKER.toLowerCase() === 'true';

const acePath = './engine/ace.js';
let page: puppeteer.Page;
let browser: puppeteer.Browser;
import findChrome from 'chrome-finder';

export async function aceCheck(html: string, guidelineIds?: string | string[]): Promise<Report> {
  try {
    console.log("Opening browser...");
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || findChrome(),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch (err) {
    console.error("Error opening browser: ", err);
    throw err;

  }

  try {
    console.log("Opening page...");
    page = await browser.newPage();
  } catch (err) {
    console.error("Error opening page: ", err);
    throw err;
  }

  try {
    console.log("opened page, setting content")
    await page.setContent(html);
    await page.addScriptTag({
      path: require.resolve(acePath)
    })
    
    const report = await page.evaluate(async (guidelineIds) => {
      const checker = new ace.Checker();
      const result = await checker.check(document, guidelineIds);
      return result;
    }, guidelineIds);

    // Filter out the PASS results
    report.results = report.results.filter((result: Issue) => result.value[1] !== "PASS");
    return report;

  } finally {
    // In case something goes wrong opening page, check if it exists
    if (page) {
      await page.close();
      console.log("Page closed");
    }
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

