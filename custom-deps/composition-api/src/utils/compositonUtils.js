/**
 * retrieve the "this" reference in a composition-api context
 * @param {Object} context
 * @param {Object} instanceName
 */
// eslint-disable-next-line import/prefer-default-export
export function findInstanceFromComposition(context, instanceName) {
  const { $children } = context.parent;
  const f = $children.filter(child => child.constructor.extendOptions.name === instanceName);
  if (!f.length) return null;
  return f[0];
};
