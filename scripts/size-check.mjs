// Fails when the gzipped, comment stripped library exceeds the budget.
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const BUDGET_BYTES = 5 * 1024;
const dir = 'lib/module';

const source = readdirSync(dir)
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(join(dir, f), 'utf8'))
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/\s+/g, ' ');

const size = gzipSync(source).length;
console.log(`gzipped size: ${size} B (budget ${BUDGET_BYTES} B)`);
if (size > BUDGET_BYTES) {
  console.error('Bundle size budget exceeded');
  process.exit(1);
}
