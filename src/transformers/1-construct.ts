// eslint-disable-next-line import/no-extraneous-dependencies
import { JSCodeshift, Collection } from "jscodeshift";

export const construct = (
  j: JSCodeshift,
  root: Collection<any>
): Collection<any> => {
  // check to see if Construct is imported from @aws-cdk/core
  const constructImport = root.find(j.ImportDeclaration, {
    source: { value: "@aws-cdk/core" },
    specifiers: [{ imported: { name: "Construct" } }],
  });

  // remove only the Construct import
  if (constructImport.length > 0) {
    constructImport.forEach((imp) => {
      const constructSpecifier = imp.node.specifiers?.find(
        (specifier: any) => specifier.imported.name === "Construct"
      );
      if (constructSpecifier) {
        imp.node.specifiers = imp.node.specifiers?.filter(
          (specifier) => specifier !== constructSpecifier
        );
        // if there are no more specifiers, remove the import
        if (imp.node.specifiers?.length === 0) {
          j(imp).remove();
        }
        // if import { Construct } from 'constructs' does not exist
        // add it as the last import

        const constructsImport = root.find(j.ImportDeclaration, {
          source: { value: "constructs" },
        });
        if (constructsImport.length === 0) {
          const newImport = j.importDeclaration(
            [j.importSpecifier(j.identifier("Construct"))],
            j.literal("constructs")
          );
          root.find(j.ImportDeclaration).at(-1).insertAfter(newImport);
        }
      }
    });
  }

  return root;
};
