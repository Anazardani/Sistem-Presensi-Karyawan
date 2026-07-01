// Jalankan sekali: node download-models.js
// Script ini mendownload model face-api.js ke folder public/models

import https from "https";
import fs from "fs";
import path from "path";

const BASE_URL =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const FILES = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
];

const OUT_DIR = "./public/models";
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const download = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });

(async () => {
  console.log("Downloading face-api.js models...\n");
  for (const file of FILES) {
    const url = `${BASE_URL}/${file}`;
    const dest = path.join(OUT_DIR, file);
    process.stdout.write(`  Downloading ${file}...`);
    try {
      await download(url, dest);
      console.log(" ✓");
    } catch (e) {
      console.log(` ✗ (${e.message})`);
    }
  }
  console.log("\nSelesai! Model tersimpan di ./public/models/");
  console.log("Jalankan: npm run dev");
})();
