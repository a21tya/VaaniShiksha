import { spawn } from 'node:child_process';
const children = [spawn('bash', ['tts_service/start.sh'], { stdio: 'inherit' }), spawn('npm', ['run', 'dev'], { stdio: 'inherit' })];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill('SIGTERM');
  process.exitCode = code;
}
for (const child of children) {
  child.on('error', () => stop(1));
  child.on('exit', (code) => stop(code ?? 0));
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
