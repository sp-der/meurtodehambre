import { spawn } from 'node:child_process';

const forwarded = process.argv.slice(2);
const nextArgs = ['dev'];

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];

  if (argument === '--host') {
    nextArgs.push('--hostname', forwarded[index + 1]);
    index += 1;
  } else if (argument === '--strictPort') {
    // Next.js already fails when its requested port cannot be bound.
  } else {
    nextArgs.push(argument);
  }
}

const child = spawn('next', nextArgs, { stdio: 'inherit' });

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
