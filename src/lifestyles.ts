type Disposer = () => void;

const _disposers = new WeakMap<Object, Disposer[]>();

function addOrSet(obj: Object, disp: Disposer) {
  const ds = _disposers.get(obj);
  if (!ds) {
    _disposers.set(obj, [disp]);
  } else {
    ds.push(disp);
  }
}

export function ldisposer(obj: Object, disp: Disposer) {
  addOrSet(obj, disp);
}

export function lstop(obj: Object) {
  const ds = _disposers.get(obj);
  if (!ds) {
    throw new Error(
      "Illegal lifestyle, attempted to stop without disposers: " + obj
    );
  }
  for (const d of ds) {
    d();
  }
  _disposers.delete(obj);
}

export function lunsub<T extends { unsubscribe: () => void }>(
  obj: Object,
  obs: T
) {
  addOrSet(obj, () => obs.unsubscribe());
  return obs;
}
