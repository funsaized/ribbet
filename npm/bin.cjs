#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { install } = require('./install.cjs');

async function main() {
  let binary = path.join(__dirname, 'native', process.platform === 'win32' ? 'ribbit.exe' : 'ribbit');

  if (!fs.existsSync(binary)) binary = await install();
  const child = spawn(binary, process.argv.slice(2), { stdio: 'inherit', windowsHide: true });
  const forward = (signal) => {
    if (!child.killed) child.kill(signal);
  };

  const interrupt = () => forward('SIGINT');
  const terminate = () => forward('SIGTERM');

  process.on('SIGINT', interrupt);
  process.on('SIGTERM', terminate);
  child.on('error', (error) => {
    console.error(`ribbit: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    process.removeListener('SIGINT', interrupt);
    process.removeListener('SIGTERM', terminate);
    process.exitCode = code ?? (signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1);
  });
}

main().catch((error) => {
  console.error(`ribbit: ${error.message}`);
  process.exitCode = 1;
});
