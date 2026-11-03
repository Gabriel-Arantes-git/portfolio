type Tree = { [key: string]: string | Tree };

export function mergeDict<T extends Tree>(base: T, override: unknown): T {
  const out: Tree = {};
  const src = (override && typeof override === 'object' ? override : {}) as Record<string, unknown>;
  for (const key of Object.keys(base)) {
    const b = base[key];
    const o = src[key];
    if (typeof b === 'string') {
      out[key] = typeof o === 'string' && o.trim() !== '' ? o : b;
    } else {
      out[key] = mergeDict(b, o);
    }
  }
  return out as T;
}
