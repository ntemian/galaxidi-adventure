// Export VOICE_MAP for index.html from manifest.json
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(__dirname + "/manifest.json", "utf8"));

let code = "const VOICE_MAP = {\n";
const entries = Object.values(manifest);
entries.forEach((entry, i) => {
  const text = entry.text.replace(/'/g, "\\'");
  const comma = i < entries.length - 1 ? "," : "";
  code += "  '" + text + "': 'voice/" + entry.file + "'" + comma + "\n";
});
code += "};\n";

fs.writeFileSync(__dirname + "/voice-map-export.js", code);
console.log("Exported VOICE_MAP with " + entries.length + " entries (with voice/ prefix)");
