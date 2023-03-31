#!/usr/bin/env node

// Most of the code from here is from bin/jscodeshift.js
// It's kept that way so that users can reuse jscodeshift options.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path from "path";
import Runner from "jscodeshift/dist/Runner";

const args = process.argv.slice(2);
const example = args.includes("--example");
const dryRun = args.includes("--dry-run");

let options, positionalArguments;

function run(paths, options) {
  const baseFolder = example ? path.resolve("test/fixtures") : cwd();
  const transformPath =
    props.transformPath || example
      ? path.resolve("src/transformers/index.ts")
      : path.resolve("lib/transformers/index.js");
  const options = props.options || {
    dry: dryRun || example,
    print: true,
    verbose: 1,
    parser: "ts",
  };
  const paths = props.paths || listFiles(baseFolder, [], ".ts");
  Runner.run(transformPath, paths, options);
}

if (options.stdin) {
  let buffer = "";
  process.stdin.on("data", (data) => (buffer += data));
  process.stdin.on("end", () => run(buffer.split("\n"), options));
} else {
  run(positionalArguments, options);
}
