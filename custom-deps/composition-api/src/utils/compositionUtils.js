/**
 * retrieve the "this" reference in a composition-api context
 * @param {Object} context
 * @param {Object} instanceName
 */
// eslint-disable-next-line import/prefer-default-export
export function findInstanceFromComposition(context, instanceName) {
  const f = context.parent.$children.filter(child => {
    return (new RegExp(`-${instanceName}$`)).test(child.$vnode.tag)
      || child.constructor.extendOptions.name === instanceName;
  });
  if (!f.length) return null;
  return f[0];
}

