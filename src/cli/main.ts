const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--version') {
  console.log('ribbit 0.1.0-dev.0');
} else if (args.length === 0 || (args.length === 1 && args[0] === '--help')) {
  console.log('Ribbit — Small commands. Big hops.\n\nDevelopment build. Command engine is under implementation.\n\n  --help     Show help\n  --version  Show version');
} else {
  console.error('ribbit: command is not implemented in this development build');
  process.exitCode = 2;
}
