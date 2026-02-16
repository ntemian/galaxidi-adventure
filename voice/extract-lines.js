const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../index.html", "utf8");
const re = /\{s:'([^']*)',t:'([^']+)'\}/g;
let m, lines = [];
const seen = new Set();
while ((m = re.exec(html)) !== null) {
  const key = m[1] + "|" + m[2];
  if (!seen.has(key)) {
    seen.add(key);
    lines.push({ speaker: m[1], text: m[2] });
  }
}
lines.sort((a, b) => a.speaker.localeCompare(b.speaker));
fs.writeFileSync(__dirname + "/dialog-lines.json", JSON.stringify(lines, null, 2));
console.log("Total unique lines:", lines.length);
const counts = {};
lines.forEach(l => { counts[l.speaker || "NARRATOR"] = (counts[l.speaker || "NARRATOR"] || 0) + 1; });
Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log("  " + k + ": " + v));
