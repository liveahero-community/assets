// Node modules.
import { readdirSync } from 'fs';
import { join } from 'path';

const getDirectoriesDeeply = (path: string, stack: string[] = []) => {
  const dirs = readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (dirs.length) {
    dirs.forEach((dir) => getDirectoriesDeeply(join(path, dir), stack));
  } else {
    stack.push(path);
  }

  return stack;
};

const getFilesDeeply = (path: string, extention?: string, stack: string[] = []) => {
  const dirs = readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const files = readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .filter((name) => extention ? name.match(new RegExp(`\\.${extention}$`)) : true);

  if (dirs.length) {
    dirs.forEach((dir) => getFilesDeeply(join(path, dir), extention, stack));
  }

  if (files.length) {
    files.forEach((file) => stack.push(join(path, file)));
  }

  return stack;
};

export {
  getDirectoriesDeeply,
  getFilesDeeply,
};
