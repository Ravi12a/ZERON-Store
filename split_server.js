import fs from 'fs';

const code = fs.readFileSync('server.ts', 'utf8');

// The goal is to move everything up to the `if (process.env.NODE_ENV !== "production") {` line into `api.ts`
// And export `app`.

const parts = code.split('  // Vite middleware for development');
let apiCode = parts[0];

// apiCode contains `async function startServer() {\n  const app = express();`
apiCode = apiCode.replace('async function startServer() {', '');
// remove the indentation from apiCode
apiCode = apiCode.split('\n').map(line => {
  if (line.startsWith('  ')) return line.substring(2);
  return line;
}).join('\n');

// Also need to move createQikinkOrder to api.ts, since it's at the bottom of server.ts
const rest = parts[1];
const qikinkPart = rest.substring(rest.indexOf('// Helper: Call Qikink Open API securely'));

// Now construct api.ts
let finalApiCode = apiCode + '\n' + qikinkPart.replace('startServer();', '');
finalApiCode = finalApiCode.replace('const app = express();', 'export const app = express();');
// We need to keep the imports at the top
fs.writeFileSync('api.ts', finalApiCode);

// Now construct server.ts
let finalServerCode = `import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./api.js";

async function startServer() {
  const PORT = process.env.PORT || 3000;

  // Vite middleware for development
` + parts[1].substring(0, parts[1].indexOf('// Helper: Call Qikink Open API securely'));

fs.writeFileSync('server.ts', finalServerCode);

