#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path";

const args = process.argv.slice(2);

// Tailwind 4.x uses an ESM entry point:
const tailwindCli = path.resolve("node_modules/tailwindcss/cli.js");

const tailwind = spawn("node", [tailwindCli, ...args], {
  stdio: "inherit",
  shell: true,
});

tailwind.on("close", (code) => process.exit(code));
