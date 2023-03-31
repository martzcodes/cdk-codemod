// eslint-disable-next-line import/no-extraneous-dependencies
import { JSCodeshift, Collection } from "jscodeshift";

export const coreToBase = (
  j: JSCodeshift,
  root: Collection<any>
): Collection<any> => {
  // check to see if there are imports from @aws-cdk/core
  const cdkImports = root.find(j.ImportDeclaration, {
    source: { value: "@aws-cdk/core" },
  });
  // rename all imports from @aws-cdk/core to aws-cdk-lib
  cdkImports.forEach((imp) => {
    imp.node.source.value = "aws-cdk-lib";
  });

  return root;
};
