/**
 * `npm run dev:local`: dev server on :3000 with no access to production Sanity, Firebase or
 * Postmark. See scripts/sandbox-env.cjs and docs/TESTING.md.
 */
const { spawn } = require('child_process');
const { buildSandboxEnv } = require('./sandbox-env.cjs');

const port = process.env.PORT || '3000';
const env = { ...process.env, ...buildSandboxEnv(`http://localhost:${port}`) };

console.log(`[dev:local] sandbox mode: mock Sanity data, in-memory subscribers/email, placeholder credentials`);
const child = spawn('npx', ['next', 'dev', '-p', port], { stdio: 'inherit', env });
child.on('exit', (code) => process.exit(code ?? 0));
