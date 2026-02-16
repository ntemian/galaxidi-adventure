const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(__dirname + "/manifest.json", "utf8"));
for (const [key, entry] of Object.entries(manifest)) {
  if (entry.file === "giannis/001.mp3") {
    console.log("Key:", key);
    console.log("Text:", entry.text);
    console.log("Speaker:", entry.speaker);
  }
}
