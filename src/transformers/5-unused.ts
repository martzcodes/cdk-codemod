// eslint-disable-next-line import/no-extraneous-dependencies
import { JSCodeshift, Collection } from "jscodeshift";

export const unused = (j: JSCodeshift, root: Collection<any>): Collection<any> => {
  // find all unused named imports in a file and remove them
  const namedImports = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        type: "ImportSpecifier",
      },
    ],
  });

  namedImports.forEach((imp) => {
    imp.node.specifiers?.forEach((specifier: any) => {
      if (specifier.local?.name) {
        const localName = specifier.local.name;
        const isUsed = root.find(j.Identifier, {
          name: localName,
        }).filter((path) => path.name !== "local" && path.name !== "imported");
        console.log(`${localName} is used ${isUsed.length} times`);
        if (isUsed.length === 0) {
          imp.node.specifiers = imp.node.specifiers?.filter(
            (specifier: any) => specifier.local.name !== localName
          );
        }
      }
    });
    if (imp.node.specifiers?.length === 0) {
      j(imp).remove();
    }
  });

  // find all unused default imports in a file and remove them
  const defaultImports = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
      },
    ],
  });

  defaultImports.forEach((imp) => {
    if (imp.node.specifiers) {
      const localName = imp.node.specifiers[0].local?.name;
      const isUsed = root.find(j.Identifier, {
        name: localName,
      });
      if (isUsed.length === 0) {
        j(imp).remove();
      }
    }
  });

  // find all unused namespace imports in a file and remove them
  const namespaceImports = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        type: "ImportNamespaceSpecifier",
      },
    ],
  });

  namespaceImports.forEach((imp) => {
    if (imp.node.specifiers) {
      const localName = imp.node.specifiers[0].local?.name;
      const isUsed = root.find(j.Identifier, {
        name: localName,
      });
      if (isUsed.length === 0) {
        j(imp).remove();
      }
    }
  });

  return root;
};
