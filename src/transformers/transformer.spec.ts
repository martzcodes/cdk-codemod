import { readFile } from "fs/promises";
import path from "path";
import jscodeshift from "jscodeshift";
import { describe, expect, it } from "vitest";
import { listFiles } from "../utils/listFiles";

import transformer from "./transformer";

describe("transformer", () => {
  const paths = listFiles(path.resolve("src/transformers/__fixtures__"), [], ".ts");
  it.each(paths)(
    "%s",
    async (inputPath) => {
      const inputCode = await readFile(inputPath, "utf8");
      const input = { path: inputPath, source: inputCode };

      const output = await transformer(input, {
        j: jscodeshift,
        jscodeshift,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        stats: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        report: () => {},
      });
      expect(output.trim()).toMatchSnapshot();
    },
    100000
  );
});
