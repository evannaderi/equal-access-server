import express from 'express';
// import puppeteer from 'puppeteer';
import type { Report } from "./engine-types/v4/api/IReport";
import { Request, Response, NextFunction } from 'express';
import { aceCheck } from './aceChecker';
import bodyParser from 'body-parser';
import * as puppeteer from 'puppeteer-core';

const is_docker = process.env.IS_DOCKER && process.env.IS_DOCKER.toLowerCase() === 'true';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let browser: puppeteer.Browser;

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

/**
 * The main scan endpoint that takes in the HTML content and the guideline IDs to scan against.
 * @param {string} html - The HTML content to scan.
 * @param {string | string[]} guidelineIds - The guideline IDs to scan against.
    * Can be: WCAG_2_1, WCAG_2_2, WCAG_2_0, IBM_Accessibility, IBM_Accessibility_Next
    * See the full list of guideline IDs at /ace-engine/src/v4/ruleset.ts
 * @returns {Report} - The scan report.
 * @example
 * {
 * "html": "<!DOCTYPE html><html><head><title>Test</title></head><body>Hello World</body></html>",
 * "guidelineIds": ["WCAG_2_2"]
}
 */
app.post("/scan", asyncHandler(async (req, res) => {
  console.log("Scanning...");
  const html: string = req.body.html;
  const guidelineIds: string | string[] = req.body.guidelineIds || process.env.DEFAULT_GUIDELINE_IDS;
  const report: Report = await aceCheck(html, browser, guidelineIds);
  console.log("Scan complete.");
  res.json(report);
}));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

(async () => {
  try {
    browser = is_docker ? await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox']
    }) : await puppeteer.launch();
    app.listen(PORT, () => {
      console.log(`Equal access server is running on port ${PORT}`);
      console.log(`is docker is ${is_docker}`);
    });
  } catch (err) {
    console.error("Error launching Puppeteer:", err);
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  if (browser) {
    await browser.close();
  }
  process.exit();
});
