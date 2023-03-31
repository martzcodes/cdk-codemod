# cdk-codemod

This project uses jscodeshift to help with migrating from CDK 1 to CDK 2.  It will:

1. Convert namespaced imports to named imports
2. Replace imports from `@aws-cdk/core` to `aws-cdk-lib`
3. Replace imports from `@aws-cdk/<module>` to `aws-cdk-lib/<module>`
4. Update `aws-cdk-lib/asserts` to `aws-cdk-lib/assertions`
5. Update package.json to remove `@aws-cdk/*` dependencies and replace with `aws-cdk-lib`
6. Update cdk.json to remove unused contexts
7. Remove unused imports from files (general clean up)

Since project structures aren't known ahead of time... it recursively does this to all files in the project... USE AT YOUR OWN RISK

It does NOT update your actual unit tests.  There is a migration script for that already: https://github.com/aws/aws-cdk/blob/v1-main/packages/@aws-cdk/assertions/MIGRATING.md#migration-script

To run: `npx cdk-codemod` in your project of choice.

Happy upgrading!

