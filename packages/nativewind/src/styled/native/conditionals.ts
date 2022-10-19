import { atoms } from "../../style-sheet/native/runtime";

export function withConditionals(
  className = "",
  componentState: Record<string, boolean | number> = {}
) {
  const keyTokens: string[] = [];
  let meta: Record<string, boolean> = {};

  for (const atomName of className.split(/\s+/)) {
    const atom = atoms.get(atomName);

    if (atom?.conditions) {
      const conditionsPass = atom.conditions.every((condition) => {
        switch (condition) {
          case "not-first-child":
            return (
              typeof componentState["nthChild"] === "number" &&
              componentState["nthChild"] > 0
            );
          case "odd":
            return (
              typeof componentState["nthChild"] === "number" &&
              typeof componentState["nthChild"] === "number" &&
              componentState["nthChild"] % 2 === 1
            );
          case "even":
            return (
              typeof componentState["nthChild"] === "number" &&
              componentState["nthChild"] % 2 === 0
            );
          default: {
            return Boolean(componentState[condition]);
          }
        }
      });

      if (conditionsPass) {
        keyTokens.push(atomName);
        meta = { ...meta, ...atom.meta };
      }
    } else if (atom) {
      keyTokens.push(atomName);
      meta = { ...meta, ...atom.meta };
    }
  }

  return {
    className: keyTokens.join(" "),
    meta,
  };
}
