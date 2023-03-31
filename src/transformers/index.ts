// eslint-disable-next-line import/no-extraneous-dependencies
import { FileInfo, API } from "jscodeshift";
import { namespaceToNamed } from "./0-namespace-to-named";
import { construct } from "./1-construct";
import { coreToBase } from "./2-core-to-base";
import { submodulesToBase } from "./3-submodules-to-base";
import { assertions } from "./4-assertions";

export const transformer = (file: FileInfo, api: API): string => {
  const j = api.jscodeshift.withParser("ts")
  const root = j(file.source);

  const namespaceFixed = namespaceToNamed(j, root);
  // use construct transformer with the output of namespaceToNamed
  const constructFixed = construct(j, namespaceFixed);
  // use coreToBase transformer with the output of construct
  const coreToBaseFixed = coreToBase(j, constructFixed);
  // use submodulesToBase transformer with the output of coreToBase
  const submodulesToBaseFixed = submodulesToBase(j, coreToBaseFixed);
  // use assertions transformer with the output of submodulesToBase
  const assertionsFixed = assertions(j, submodulesToBaseFixed);

  return assertionsFixed.toSource();
};

export default transformer;
