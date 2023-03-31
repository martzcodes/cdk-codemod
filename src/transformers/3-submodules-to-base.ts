// eslint-disable-next-line import/no-extraneous-dependencies
import { JSCodeshift, Collection } from "jscodeshift";

export const submodulesToBase = (
  j: JSCodeshift,
  root: Collection<any>
): Collection<any> => {
  // check to see if there are imports that start with @aws-cdk/
  const allImports = root.find(j.ImportDeclaration);
  // replace all imports from @aws-cdk/* to aws-cdk-lib/*
  allImports.forEach((imp) => {
    if (`${imp.node.source.value}`.startsWith("@aws-cdk/")) {
      imp.node.source.value = `${imp.node.source.value}`.replace(
        "@aws-cdk/",
        "aws-cdk-lib/"
      );
    }
  });

  return root;
};
