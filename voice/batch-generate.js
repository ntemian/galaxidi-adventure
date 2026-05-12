#!/usr/bin/env node
// Batch voice generation for phase2 dialogue lines
const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = "sk_27295e2e16c05e3d5ea663a8b800bbd15261084f8345f802";
const BASE_URL = "api.elevenlabs.io";

const VOICE_CONFIG = {
  "": { voice: "pqHfZKP75CvOlQylNhV4", dir: "narrator", stability: 0.6, similarity: 0.8, style: 0.2 },
  "ΝΤΕΜΗΣ": { voice: "JBFqnCBsd6RMkjVDRZzb", dir: "ntemis", stability: 0.55, similarity: 0.8, style: 0 },
  "ΚΛΕΙΩ": { voice: "cgSgspJ2msm6clMCkdW9", dir: "clio", stability: 0.45, similarity: 0.75, style: 0 },
  "ΑΙΑΣ": { voice: "IKne3meq5aSn9XLyUdCD", dir: "ajax", stability: 0.4, similarity: 0.75, style: 0 },
  "ΑΘΟΣ": { voice: "nPczCjzI2devNBz1zQrb", dir: "athos", stability: 0.55, similarity: 0.8, style: 0 },
  "ΕΠΙΜΕΛΗΤΗΣ": { voice: "onwK4e9ZLuTAKqWW03F9", dir: "curator", stability: 0.55, similarity: 0.8, style: 0 },
  "ΓΙΑΝΝΗΣ": { voice: "CwhRBWXzGAHq8TQ4Fs17", dir: "giannis", stability: 0.6, similarity: 0.8, style: 0 },
  "ΣΤΑΘΗΣ": { voice: "TX3LPaxmHKxFdv7VOQHJ", dir: "stathis", stability: 0.45, similarity: 0.75, style: 0 },
  "ΑΚΗΣ": { voice: "cjVigY5qzO86Huf0OWal", dir: "akis", stability: 0.5, similarity: 0.8, style: 0 },
  "ΠΑΠΑΣ": { voice: "n0vzWypeCK1NlWPVwhOc", dir: "papas", stability: 0.55, similarity: 0.8, style: 0 },
  "ΧΡΥΣΟΣΤΟΜΟΣ": { voice: "iP95p4xoKVk53GoZ742B", dir: "chrysostomos", stability: 0.6, similarity: 0.8, style: 0 }
};

function getNextFileNum(dir) {
  const voiceDir = path.join(__dirname, dir);
  if (!fs.existsSync(voiceDir)) fs.mkdirSync(voiceDir, { recursive: true });
  const files = fs.readdirSync(voiceDir).filter(f => f.endsWith(".mp3")).sort();
  if (files.length === 0) return 1;
  const last = parseInt(files[files.length - 1].replace(".mp3", ""), 10);
  return last + 1;
}

function generateVoice(text, voiceId, outputPath, stability, similarity, style) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability,
        similarity_boost: similarity,
        style: style || 0,
        use_speaker_boost: true
      }
    });

    const options = {
      hostname: BASE_URL,
      path: `/v1/text-to-speech/${voiceId}`,
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
        "Content-Length": Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errData = "";
        res.on("data", d => errData += d);
        res.on("end", () => reject(new Error(`HTTP ${res.statusCode}: ${errData}`)));
        return;
      }
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(outputPath, buffer);
        resolve(outputPath);
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const lines = JSON.parse(fs.readFileSync(path.join(__dirname, "phase2-generate.json"), "utf8"));
  console.log(`Generating ${lines.length} voice lines...`);

  // Track next file number per speaker dir
  const nextNum = {};
  for (const cfg of Object.values(VOICE_CONFIG)) {
    nextNum[cfg.dir] = getNextFileNum(cfg.dir);
  }
  console.log("Starting numbers:", JSON.stringify(nextNum));

  // Track results for VOICE_MAP update
  const results = [];
  let done = 0;
  let failed = 0;

  // Process in batches of 5 (rate limit friendly)
  const BATCH_SIZE = 5;
  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    const batch = lines.slice(i, i + BATCH_SIZE);
    const promises = batch.map(line => {
      const cfg = VOICE_CONFIG[line.speaker];
      if (!cfg) {
        console.log(`  SKIP: Unknown speaker "${line.speaker}"`);
        return Promise.resolve(null);
      }

      const num = String(nextNum[cfg.dir]++).padStart(3, "0");
      const relPath = `voice/${cfg.dir}/${num}.mp3`;
      const absPath = path.join(__dirname, cfg.dir, `${num}.mp3`);

      return generateVoice(
        line.text, cfg.voice, absPath,
        cfg.stability, cfg.similarity, cfg.style
      ).then(p => {
        done++;
        const size = (fs.statSync(p).size / 1024).toFixed(0);
        console.log(`  [${done}/${lines.length}] ${cfg.dir}/${num}.mp3 (${size}KB) — ${line.text.substring(0, 50)}...`);
        results.push({ speaker: line.speaker, text: line.text, file: relPath });
        return { success: true };
      }).catch(err => {
        failed++;
        console.error(`  FAIL: ${cfg.dir}/${num}.mp3 — ${err.message}`);
        results.push({ speaker: line.speaker, text: line.text, file: relPath, error: err.message });
        return { success: false };
      });
    });

    await Promise.all(promises);

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < lines.length) {
      await sleep(500);
    }
  }

  // Save results
  fs.writeFileSync(path.join(__dirname, "phase2-results.json"), JSON.stringify(results, null, 2));
  console.log(`\nDone! ${done} generated, ${failed} failed. Results in phase2-results.json`);

  // Generate VOICE_MAP entries for index.html
  const mapEntries = results
    .filter(r => !r.error)
    .map(r => `  '${r.text.replace(/'/g, "\\'")}': '${r.file}',`)
    .join("\n");
  fs.writeFileSync(path.join(__dirname, "phase2-voicemap.js"), mapEntries);
  console.log("VOICE_MAP entries saved to phase2-voicemap.js");
}

main().catch(console.error);
