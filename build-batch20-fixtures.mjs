import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const fixtures = [
  { source: 'festival-logo-sample.svg', output: 'festival-logo-sample.png', width: 400, height: 160 },
  { source: 'festival-image-sample.svg', output: 'festival-image-sample.png', width: 800, height: 420 },
];

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const fixture of fixtures) {
    const sourcePath = join(root, 'assets', 'fixtures', fixture.source);
    const outputPath = join(root, 'assets', 'fixtures', fixture.output);
    const svg = readFileSync(sourcePath, 'utf8');
    await page.setViewportSize({ width: fixture.width, height: fixture.height });
    await page.setContent(
      `<style>html,body{margin:0;width:${fixture.width}px;height:${fixture.height}px;overflow:hidden}svg{display:block}</style>${svg}`,
      { waitUntil: 'load' },
    );
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`Generated ${fixture.output}`);
  }
} finally {
  await browser.close();
}
