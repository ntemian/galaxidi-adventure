const fs = require("fs");
const path = require("path");
const manifest = JSON.parse(fs.readFileSync(__dirname + "/manifest.json", "utf8"));

let ok = 0, missing = 0;
const missingFiles = [];

for (const [key, entry] of Object.entries(manifest)) {
  const fp = path.join(__dirname, entry.file);
  if (fs.existsSync(fp)) {
    ok++;
  } else {
    missing++;
    missingFiles.push(entry.file + " <- " + entry.speaker + ": " + entry.text.substring(0, 60));
  }
}

console.log("Files found: " + ok);
console.log("Files MISSING: " + missing);
if (missingFiles.length > 0) {
  console.log("");
  missingFiles.forEach(f => console.log("  MISSING: " + f));
}
