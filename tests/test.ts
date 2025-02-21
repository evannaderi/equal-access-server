import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const htmlDir = './html-files';
const PORT = 3000;
const guidelineIds = ['WCAG_2_2'];

async function runTests() {
  const files = await fs.readdir(htmlDir);
  const outputDir = path.join(__dirname, 'output');
  await fs.mkdir(outputDir, { recursive: true });
  for (const file of files) {
    if (path.extname(file) !== '.html') continue;
    const filePath = path.join(htmlDir, file);
    const html = await fs.readFile(filePath, 'utf-8');
    const start = Date.now();
    try {
      const response = await axios.post(`http://localhost:${PORT}/scan`, {
        html,
        guidelineIds: guidelineIds
      });
      console.log(`${file}: ${Date.now() - start}ms`);
      const outPath = './output/' + file.replace('.html', '.json');
      await fs.writeFile(outPath, JSON.stringify(response.data, null, 2));
      console.log(`Output written to ${outPath}`);
    } catch (err) {
      console.error(`${file} error after ${Date.now() - start}ms:`, (err as any).message);
    }
  }
}

runTests();
