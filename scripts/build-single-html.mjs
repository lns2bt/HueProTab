import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const shellPath = path.join(root, 'src/html/shell.html');
const htmlRoot = path.join(root, 'src/html');
const cssRoot = path.join(root, 'src/css');
const jsRoot = path.join(root, 'src/js');
const outPath = path.join(root, 'dist/index.html');

function collectFiles(dir, extension) {
  return readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(fullPath, extension);
      }
      return fullPath.endsWith(extension) ? [fullPath] : [];
    });
}

function readBundle(files, formatter) {
  return files.map((file) => formatter(file, readFileSync(file, 'utf8'))).join('\n\n');
}

function templateName(file) {
  return path.relative(htmlRoot, file).replace(/\\/g, '/').replace(/\.html$/, '');
}

const shell = readFileSync(shellPath, 'utf8');
const htmlTemplates = collectFiles(htmlRoot, '.html').filter((file) => file !== shellPath);
const cssFiles = collectFiles(cssRoot, '.css');
const jsFiles = collectFiles(jsRoot, '.js');

const templates = readBundle(
  htmlTemplates,
  (file, contents) => `<template data-template="${templateName(file)}">\n${contents.trim()}\n</template>`
);
const css = readBundle(cssFiles, (file, contents) => `/* ${path.relative(root, file)} */\n${contents.trim()}`);
const js = readBundle(jsFiles, (file, contents) => `// ${path.relative(root, file)}\n${contents.trim()}`);

const html = shell
  .replace('<!-- INLINE_CSS -->', `<style>\n${css}\n</style>`)
  .replace('<!-- INLINE_TEMPLATES -->', templates)
  .replace('<!-- INLINE_JS -->', `<script>\n${js}\n</script>`);

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, html);
console.log(`Built ${path.relative(root, outPath)}`);
