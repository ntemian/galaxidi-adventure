const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(__dirname + "/manifest.json", "utf8"));
const story = JSON.parse(fs.readFileSync(__dirname + "/story-dialog.json", "utf8"));

const missing = [];
for (const line of story) {
  const key = (line.speaker || "") + "|" + line.text;
  if (manifest[key] === undefined) {
    missing.push(line);
  }
}

console.log("Story dialog lines:", story.length);
console.log("Already have voice:", story.length - missing.length);
console.log("Need generation:", missing.length);
console.log("");

const bySpeaker = {};
missing.forEach(l => {
  const s = l.speaker || "NARRATOR";
  if (!bySpeaker[s]) bySpeaker[s] = [];
  bySpeaker[s].push({ scene: l.scene, text: l.text });
});

Object.entries(bySpeaker).sort((a, b) => b[1].length - a[1].length).forEach(([s, items]) => {
  console.log(s + " (" + items.length + " lines):");
  items.forEach(i => console.log("  Sc" + i.scene + ": " + i.text));
  console.log("");
});

fs.writeFileSync(__dirname + "/phase2-generate.json", JSON.stringify(missing, null, 2));
console.log("Saved phase2-generate.json");
