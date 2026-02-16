// Voice generation manifest builder
// Maps speaker names to voice IDs and output directories
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
const lines = JSON.parse(fs.readFileSync(__dirname + "/dialog-lines.json", "utf8"));

// Build manifest with file paths
const manifest = {};
const counters = {};

for (const line of lines) {
  const cfg = VOICE_MAP[line.speaker];
  if (!cfg || !cfg.voice) continue; // skip ghost

  counters[cfg.dir] = (counters[cfg.dir] || 0) + 1;
  const num = String(counters[cfg.dir]).padStart(3, "0");
  const filename = `${cfg.dir}/${num}.mp3`;

  const key = line.speaker + "|" + line.text;
  manifest[key] = {
    file: filename,
    voice_id: cfg.voice,
    speaker: line.speaker,
    text: line.text,
    stability: cfg.stability || 0.5,
    similarity_boost: cfg.similarity || 0.75,
    style: cfg.style || 0
  };
}

fs.writeFileSync(__dirname + "/manifest.json", JSON.stringify(manifest, null, 2));
console.log("Manifest created with", Object.keys(manifest).length, "entries");
console.log("Voice assignments:");
Object.entries(VOICE_MAP).forEach(([k, v]) => {
  const count = lines.filter(l => l.speaker === k).length;
  if (count > 0) console.log(`  ${v.label}: ${count} lines`);
});
