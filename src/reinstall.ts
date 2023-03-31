import { exec as execSync } from "child_process";
import { cwd } from "process";
import util from "util";
const exec = util.promisify(execSync);

export const reinstall = async (updatedPackages: Record<string, string>) => {
  const originalDir = cwd();
  const packagePaths = Object.keys(updatedPackages).map((key) => key.replace('/package.json', ''));
  for (const packagePath of packagePaths) {
    await exec(`cd ${packagePath} && rm -rf node_modules package-lock.json && npm install`);
  }
  await exec(`cd ${originalDir}`);
};
