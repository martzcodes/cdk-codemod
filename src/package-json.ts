import { exec as execSync } from "child_process";
import { readdirSync, readFileSync } from "fs";
import util from "util";
const exec = util.promisify(execSync);

const getVersion = async (packageName: string) => {
  const { stdout: version } = await exec(`npm view ${packageName} version`);
  return `${version}`.replace(/\n$/, "");
};

const listPackageJsons = (dir: string, fileList: string[] = []) => {
  const files = readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    if (file.name === "node_modules") return;
    if (file.isDirectory()) {
      fileList = listPackageJsons(`${dir}/${file.name}`, fileList);
    } else {
      if (file.name === "package.json") {
        fileList.push(`${dir}/${file.name}`);
      }
    }
  });
  return fileList;
};

export const updatePackageJson = async (baseFolder: string) => {
  // read package.json file
  const updatedPackages: Record<string, string> = {};
  const packageJsons = listPackageJsons(baseFolder);
  for (const packageJsonPath of packageJsons) {
    // use fs to readFileSync the file at packageJsonPath
    const packageJson = JSON.parse(
      readFileSync(packageJsonPath, { encoding: "utf-8" })
    );

    console.log(packageJson);

    let cdkExisted = false;
    // remove all @aws-cdk dependencies from packageJson
    Object.keys(packageJson.dependencies).forEach((key) => {
      if (key.startsWith("@aws-cdk/")) {
        cdkExisted = true;
        delete packageJson.dependencies[key];
      }
    });

    // remove all @aws-cdk devDependencies from packageJson
    Object.keys(packageJson.devDependencies).forEach((key) => {
      if (key.startsWith("@aws-cdk/")) {
        cdkExisted = true;
        delete packageJson.devDependencies[key];
      }
    });

    if (cdkExisted) {
      // run a shell command to get the latest npm version of a package
      const awsCdkVersion = await getVersion("aws-cdk-lib");
      // add aws-cdk-lib to packageJson dependencies
      packageJson.dependencies["aws-cdk-lib"] = `^${awsCdkVersion}`;
      if (packageJson.devDependencies["aws-cdk-lib"]) {
        delete packageJson.devDependencies["aws-cdk-lib"];
      }

      // run a shell command to get the latest npm version of a package
      const constructs = await getVersion("constructs");
      // add constructs to packageJson dependencies
      packageJson.dependencies.constructs = `^${constructs}`;

      if (packageJson.devDependencies.constructs) {
        delete packageJson.devDependencies.constructs;
      }

      // run a shell command to get the latest npm version of a package
      const cdkCli = await getVersion("aws-cdk");
      // add cdkCli to packageJson dependencies
      packageJson.devDependencies["aws-cdk"] = `^${cdkCli}`;

      if (packageJson.dependencies["aws-cdk"]) {
        delete packageJson.dependencies["aws-cdk"];
      }
    }

    updatedPackages[packageJsonPath] = JSON.stringify(packageJson, null, 2);
  }

  return updatedPackages;
};
