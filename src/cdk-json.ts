import { readdirSync, readFileSync } from "fs";

const listCdkJsons = (dir: string, fileList: string[] = []) => {
  const files = readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    if (file.name === "node_modules") return;
    if (file.isDirectory()) {
      fileList = listCdkJsons(`${dir}/${file.name}`, fileList);
    } else {
      if (file.name === "cdk.json") {
        fileList.push(`${dir}/${file.name}`);
      }
    }
  });
  return fileList;
};

const flagsToDelete = [
  "@aws-cdk/core:enableStackNameDuplicates",
  "aws-cdk:enableDiffNoFail",
  "@aws-cdk/aws-ecr-assets:dockerIgnoreSupport",
  "@aws-cdk/aws-secretsmanager:parseOwnedSecretName",
  "@aws-cdk/aws-kms:defaultKeyPolicies",
  "@aws-cdk/aws-s3:grantWriteWithoutAcl",
  "@aws-cdk/aws-efs:defaultEncryptionAtRest",
];

export const updateCdkJson = async (baseFolder: string) => {
  // read package.json file
  const updatedJsons: Record<string, string> = {};
  const cdkJsons = listCdkJsons(baseFolder);
  for (const cdkJsonPath of cdkJsons) {
    // use fs to readFileSync the file at cdkJsonPath
    const cdkJson = JSON.parse(
      readFileSync(cdkJsonPath, { encoding: "utf-8" })
    );

    flagsToDelete.forEach((flag) => {
      if (cdkJson.context?.[flag]) {
        delete cdkJson.context[flag];
      }
    });

    updatedJsons[cdkJsonPath] = JSON.stringify(cdkJson, null, 2);
  }

  return updatedJsons;
};
