// eslint-disable-next-line import/no-extraneous-dependencies
import { JSCodeshift, Collection } from "jscodeshift";

export const assertions = (
  j: JSCodeshift,
  root: Collection<any>
): Collection<any> => {
  // check to see if there are imports from aws-cdk-lib/asserts
  const cdkImports = root.find(j.ImportDeclaration, {
    source: { value: "aws-cdk-lib/asserts" },
  });
  // rename all imports from aws-cdk-lib/asserts to aws-cdk-lib/assertions
  let replacedAssertions = false;
  cdkImports.forEach((imp) => {
    imp.node.source.value = "aws-cdk-lib/assertions";
    replacedAssertions = true;
  });
  if (replacedAssertions) {
    // TODO replace assertions from https://github.com/aws/aws-cdk/blob/v1-main/packages/@aws-cdk/assertions/MIGRATING.md
  }
  return root;
};
