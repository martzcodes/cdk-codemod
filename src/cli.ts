#!/usr/bin/env node

// Most of the code from here is from bin/jscodeshift.js
// It's kept that way so that users can reuse jscodeshift options.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path from "path";
import { cwd } from "process";
import { writeFileSync } from "fs";
import Runner from "jscodeshift/dist/Runner";
import { updatePackageJson } from "./package-json";
import { updateCdkJson } from "./cdk-json";
import { listFiles } from "./utils/listFiles";
import { reinstall } from "./reinstall";

const args = process.argv.slice(2);
const example = args.includes("--example");
const dryRun = args.includes("--dry-run");

const run = async () => {
  const baseFolder = example ? path.resolve("test/fixtures") : cwd();

  const transformPath = example
      ? path.resolve("src/transformers/transformer.ts")
      : path.join(__dirname, "/transformers/transformer.js");
  const options = {
    dry: dryRun || example,
    print: true,
    verbose: 1,
    parser: "ts",
  };
  const paths = listFiles(baseFolder, [], ".ts");
  await Runner.run(transformPath, paths, options);
  const updatedPackages = await updatePackageJson(baseFolder);
  const updatedCdks = await updateCdkJson(baseFolder);
  // write updatedPackages and updatedCdks to files
  if (!dryRun) {
    const jsonUpdates = { ...updatedPackages, ...updatedCdks };
    Object.keys(jsonUpdates).forEach((key) => {
      writeFileSync(key, jsonUpdates[key]);
    });
    await reinstall(updatedPackages);
  }

}

run();