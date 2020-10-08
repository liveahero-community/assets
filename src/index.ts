// Node modules.
import { mkdirSync, unlinkSync, copyFileSync } from 'fs';
import { join } from 'path';
import tinify from 'tinify';
// Local modules.
import { getDirectoriesDeeply, getFilesDeeply } from './utils/file-expert';

tinify.key = process.env.TINYPNG_KEY;

const sourceDir = 'raw';
const targetDir = 'build';
const keeps = [
  '.nojekyll',
];

// Make dirs.
getDirectoriesDeeply(sourceDir).forEach((dir) => {
  mkdirSync(join(targetDir, dir.replace(sourceDir, '')), { recursive: true })
});

const currentFilePaths = getFilesDeeply(targetDir).map((path) => path.replace(targetDir, ''));
const rawFilePaths = getFilesDeeply(sourceDir, 'png').map((path) => path.replace(sourceDir, ''));
const adds = rawFilePaths.filter((x) => !currentFilePaths.includes(x));
const removes = currentFilePaths.filter((x) => !rawFilePaths.includes(x));

// Minify new images.
adds.forEach((filePath) => {
  const sourceFilePath = join(sourceDir, filePath);
  const outputFilePath = join(targetDir, filePath);
  const source = tinify.fromFile(sourceFilePath);
  source.toFile(outputFilePath);
  console.log(`add: ${outputFilePath} from ${sourceFilePath}`);
});

// Remove useless images.
removes.forEach((filePath) => {
  const targetFilePath = join(targetDir, filePath);
  unlinkSync(targetFilePath);
  console.log(`remove: ${targetFilePath}`);
});

keeps.forEach((keep) => {
  const outputFilePath = join(targetDir, keep);
  copyFileSync(keep, outputFilePath);
  console.log(`copy: ${keep} to ${outputFilePath}`);
});

console.log(`Total added: ${adds.length} ; total removed: ${removes.length}`);
