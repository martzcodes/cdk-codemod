import { readdirSync } from "fs";

// recursively list all files in a directory and its subdirectories
export const listFiles = (
  dir: string,
  fileList: string[] = [],
  extension: string
) => {
  const files = readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    if (file.name === "node_modules") return;
    if (file.isDirectory()) {
      fileList = listFiles(`${dir}/${file.name}`, fileList, extension);
    } else {
      if (file.name.endsWith(extension)) {
        fileList.push(`${dir}/${file.name}`);
      }
    }
  });
  return fileList;
};
