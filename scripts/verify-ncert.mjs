import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);
const source = await readFile(new URL('../lib/learning-resources.ts', import.meta.url), 'utf8');
const books = [...source.matchAll(/book\((\d), "([^"]+)", "([^"]+)", "([^"]+)", "(\w+)=0-(\d+)"\)/g)];
const jobs = books.flatMap(([, grade, title, subject, language, id, count]) => ['ps', ...Array.from({ length: Number(count) }, (_, i) => String(i + 1).padStart(2, '0'))].map(part => ({ grade: Number(grade), title, subject, language, id, part, url: `https://ncert.nic.in/textbook/pdf/${id}${part}.pdf` })));
const results = []; let index = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (index < jobs.length) {
    const job = jobs[index++];
    try { const { stdout } = await exec('curl', ['-sSIL', '--retry', '1', '--max-time', '20', '-o', '/dev/null', '-w', '%{http_code} %{content_type}', job.url], { maxBuffer: 2000 }); const [status, type] = stdout.trim().split(' '); results.push({ ...job, status: Number(status), type, ok: status === '200' && type?.includes('pdf') }); }
    catch { results.push({ ...job, ok: false, error: 'Connection failed or timed out' }); }
  }
}));
results.sort((a, b) => a.url.localeCompare(b.url));
await writeFile(new URL('../docs/ncert-verification.json', import.meta.url), JSON.stringify({ checkedAt: new Date().toISOString(), method: 'HEAD; GET PDF signature separately checked for aemr101', results }, null, 2) + '\n');
console.log(JSON.stringify({ checked: results.length, passed: results.filter(result => result.ok).length, failed: results.filter(result => !result.ok) }, null, 2));
process.exitCode = results.some(result => !result.ok) ? 1 : 0;
