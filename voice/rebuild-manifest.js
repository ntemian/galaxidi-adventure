// Rebuild complete manifest from dialog-lines.json + story-dialog.json
// Assigns sequential file numbers per speaker directory
const VOICE_MAP = {
  "": { voice: "pqHfZKP75CvOlQylNhV4", dir: "narrator", label: "Bill (Narrator)", stability: 0.6, similarity: 0.8, style: 0.2 },
  "ΝΤΕΜΗΣ": { voice: "JBFqnCBsd6RMkjVDRZzb", dir: "ntemis", label: "George (Ntemis)", stability: 0.55, similarity: 0.8 },
  "ΚΛΕΙΩ": { voice: "cgSgspJ2msm6clMCkdW9", dir: "clio", label: "Jessica (Clio)", stability: 0.45, similarity: 0.75 },
  "ΑΙΑΣ": { voice: "IKne3meq5aSn9XLyUdCD", dir: "ajax", label: "Charlie (Ajax)", stability: 0.4, similarity: 0.75 },
  "ΑΘΟΣ": { voice: "nPczCjzI2devNBz1zQrb", dir: "athos", label: "Brian (Athos)", stability: 0.55, similarity: 0.8 },
  "ΕΠΙΜΕΛΗΤΗΣ": { voice: "onwK4e9ZLuTAKqWW03F9", dir: "curator", label: "Daniel (Curator)", stability: 0.55, similarity: 0.8 },
  "ΓΙΑΝΝΗΣ": { voice: "CwhRBWXzGAHq8TQ4Fs17", dir: "giannis", label: "Roger (Giannis)", stability: 0.6, similarity: 0.8 },
  "ΣΤΑΘΗΣ": { voice: "TX3LPaxmHKxFdv7VOQHJ", dir: "stathis", label: "Liam (Stathis)", stability: 0.45, similarity: 0.75 },
  "ΑΚΗΣ": { voice: "cjVigY5qzO86Huf0OWal", dir: "akis", label: "Eric (Akis)", stability: 0.5, similarity: 0.8 },
  "ΠΑΠΑΣ": { voice: "n0vzWypeCK1NlWPVwhOc", dir: "papas", label: "Theos (Papas)", stability: 0.55, similarity: 0.8 },
  "ΧΡΥΣΟΣΤΟΜΟΣ": { voice: "iP95p4xoKVk53GoZ742B", dir: "chrysostomos", label: "Chris (Chrysostomos)", stability: 0.6, similarity: 0.8 },
  "ΦΑΝΤΑΣΜΑ": { voice: null, dir: "ghost", label: "Ghost (silent)" }
};

const fs = require("fs");

// Load both line sources
const gameLines = JSON.parse(fs.readFileSync(__dirname + "/dialog-lines.json", "utf8"));
const storyLines = JSON.parse(fs.readFileSync(__dirname + "/story-dialog.json", "utf8"));

// Combine, deduplicating by speaker+text key
const seen = new Set();
const allLines = [];

for (const line of gameLines) {
  const key = (line.speaker || "") + "|" + line.text;
  if (!seen.has(key)) {
    seen.add(key);
    allLines.push(line);
  }
}

for (const line of storyLines) {
  const key = (line.speaker || "") + "|" + line.text;
  if (!seen.has(key)) {
    seen.add(key);
    allLines.push(line);
  }
}

// Build manifest
const manifest = {};
const counters = {};

for (const line of allLines) {
  const speaker = line.speaker || "";
  const cfg = VOICE_MAP[speaker];
  if (!cfg || !cfg.voice) continue; // skip ghost + unknown

  counters[cfg.dir] = (counters[cfg.dir] || 0) + 1;
  const num = String(counters[cfg.dir]).padStart(3, "0");
  const filename = cfg.dir + "/" + num + ".mp3";

  const key = speaker + "|" + line.text;
  manifest[key] = {
    file: filename,
    voice_id: cfg.voice,
    speaker: speaker,
    text: line.text,
    stability: cfg.stability || 0.5,
    similarity_boost: cfg.similarity || 0.75,
    style: cfg.style || 0
  };
}

fs.writeFileSync(__dirname + "/manifest.json", JSON.stringify(manifest, null, 2));

console.log("Combined manifest: " + Object.keys(manifest).length + " entries");
console.log("From game code: " + gameLines.length + " lines");
console.log("From STORY.md: " + storyLines.length + " lines");
console.log("After dedup: " + allLines.length + " unique lines");
console.log("");
console.log("Per speaker:");
Object.entries(VOICE_MAP).forEach(([k, v]) => {
  const count = counters[v.dir] || 0;
  if (count > 0) console.log("  " + v.label + ": " + count + " lines");
});
