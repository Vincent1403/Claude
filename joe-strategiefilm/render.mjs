// Rendert index.html Frame für Frame (24 fps) und legt die Musik darunter.
// Aufruf: node render.mjs [ausgabe.mp4] [von] [bis]   – von/bis in Sekunden, optional
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import url from 'node:url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, 'jo-strategiefilm.mp4');
const from = +(process.argv[3] || 0);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(url.pathToFileURL(path.join(here, 'index.html')).href + '#render');
await page.waitForFunction(() => window.FILM && window.FILM.ready);
const { END, FPS } = await page.evaluate(() => window.FILM);
const to = +(process.argv[4] || END);

const ff = spawn('ffmpeg', ['-y', '-v', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-ss', String(from), '-t', String(to - from), '-i', path.join(here, 'assets', 'music.mp3'),
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });

const n = Math.round((to - from) * FPS);
for (let i = 0; i < n; i++) {
  await page.evaluate(t => window.seek(t), from + i / FPS);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 240 === 0) console.log(`Frame ${i}/${n}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('fertig:', out);
