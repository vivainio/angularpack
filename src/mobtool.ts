import { Observable } from "rxjs/Observable";
import {
  reaction,
  computed,
  autorun,
  IReactionPublic,
  IReactionOptions,
  IReactionDisposer,
  Lambda,
  toJS
} from "mobx";
import { ChangeDetectorRef } from "@angular/core/src/change_detection/change_detector_ref";

export function addComponentDisposer(component: any, disposer: Lambda) {
  if (!component.__mobx_unsubs) {
    component.__mobx_unsubs = [disposer];
  } else {
    component.__mobx_unsubs.push(disposer);
  }
}

export function fromStoreAsPromise<T>(expression: () => T): Observable<T> {
  const obs = new Observable<T>(observer => {
    const computedValue = computed(expression);
    const disposer = computedValue.observe(changes => {
      observer.next(changes.newValue);
    }, true);

    return () => disposer && disposer();
  });
  return obs;
}

export function startObservers(
  cdr: ChangeDetectorRef | null,
  namePrefix: string | null,
  expressions: Array<[string, () => void]>
) {
  const disposers = expressions.map(pair => {
    const [name, expr] = pair;
    const wrapped = cdr ? andDetectChanges(cdr, expr) : expr;
    const disposer = autorun(wrapped, {
      name: namePrefix ? namePrefix + name : name
    });
    return disposer;
  });

  return () => disposers.forEach(d => d());
}

export function startObserving(component: any, expression: () => void): void;
export function startObserving(
  component: any,
  name: string,
  expression: () => void
);
export function startObserving(component, expressionOrName?, expression?) {
  let name: string;
  let disposer: IReactionDisposer;

  if (typeof expressionOrName === "string") {
    disposer = autorun(expression, {
      name: expressionOrName + ":" + component.constructor.name
    });
  } else {
    disposer = autorun(expressionOrName);
  }
  addComponentDisposer(component, disposer);
}

export function stopObserving(component: any) {
  if (!component.__mobx_unsubs) {
    return;
  }
  component.__mobx_unsubs.forEach(disposer => disposer());
}

export function startReacting<T>(
  component: any,
  expression: (r: IReactionPublic) => T,
  effect: (arg: T, r: IReactionPublic) => void,
  opts?: IReactionOptions
) {
  const disposer = reaction(expression, effect, opts);
  addComponentDisposer(component, disposer);
}

// unsub all observers if there are any (w/o crashing). Usable e.g. in services
export function resetObservers(component: any) {
  if (component.__mobx_unsubs) {
    stopObserving(this);
  }
}

export function autoDisposer(component: any, expr: () => () => any) {
  const disposer = expr();
  addComponentDisposer(component, disposer);
}

// create function that runs detectchanges after running the function
export function andDetectChanges(cdr: ChangeDetectorRef, expr: () => void) {
  function changeDetectWrapper() {
    expr();
    cdr.markForCheck();
  }
  return changeDetectWrapper;
}

export function logDump(...args) {
  const l = [].slice.call(arguments).map(toJS);
  console.log(...l);
}
