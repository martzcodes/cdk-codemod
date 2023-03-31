// eslint-disable-next-line import/no-extraneous-dependencies
import { Collection, JSCodeshift } from "jscodeshift";

const modulesToProcess = ["@aws-cdk"];

export const namespaceToNamed = (
  j: JSCodeshift,
  root: Collection<any>
): Collection<any> => {
  const imports = root.find(j.ImportDeclaration, {
    specifiers: [{ type: "ImportNamespaceSpecifier" }],
  });

  const importedModules: any = {};

  imports.forEach((imp) => {
    const namespaceSpecifier = `${imp.node.specifiers?.[0].local?.name}`;
    const importedModule = `${imp.node.source.value}`;
    if (
      modulesToProcess.filter((mod) => importedModule.includes(mod)).length !==
      0
    ) {
      const props: any = {};

      root
        .find(j.MemberExpression, {
          object: { name: namespaceSpecifier },
        })
        .forEach((nodePath) => {
          const property = (nodePath as any).node.property.name;
          props[property] = true;
        });
      const typeReferences = root
        .find(j.TSTypeReference)
        .paths()
        .filter(
          (nodePath) =>
            (nodePath as any).node.typeName.left.name === namespaceSpecifier
        )
        .map((nodePath) => (nodePath as any).node.typeName.right.name);
      typeReferences.forEach((typeRef) => (props[typeRef] = true));

      importedModules[namespaceSpecifier] = {
        importedModule,
        properties: Object.keys(props),
      };

      // Create new named import specifiers for each property
      const namedSpecifiers = importedModules[
        namespaceSpecifier
      ].properties.map((prop: any) => j.importSpecifier(j.identifier(prop)));

      // Replace the old namespaced import with a new named import
      const newImport = j.importDeclaration(
        namedSpecifiers,
        j.literal(importedModule)
      );
      j(imp).replaceWith(newImport);
    }
  });

  // Update references to use the new named imports
  Object.keys(importedModules).forEach((nsSpecifier) => {
    const { properties } = importedModules[nsSpecifier];
    properties.forEach((prop: any) => {
      root
        .find(j.MemberExpression, {
          object: { name: nsSpecifier },
          property: { name: prop },
        })
        .replaceWith(j.identifier(prop));
      root
        .find(j.TSTypeReference, {
          typeName: { left: { name: nsSpecifier }, right: { name: prop } },
        })
        .replaceWith(j.tsTypeReference(j.identifier(prop)));
    });
  });

  return root;
};
