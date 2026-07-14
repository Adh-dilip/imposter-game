// Copies the web app into www/ (Capacitor's webDir). Run before `cap sync`.
const fs = require("fs");
const path = require("path");

const FILES = [
  "index.html", "game.js", "sw.js", "manifest.webmanifest",
  "logo.png", "icon-192.png", "icon-512.png",
];

fs.mkdirSync("www", { recursive: true });
for (const f of FILES) fs.copyFileSync(f, path.join("www", f));
console.log(`Copied ${FILES.length} files into www/`);
