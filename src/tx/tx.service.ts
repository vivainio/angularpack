import { Injectable } from "@angular/core";
import { get, template } from "lodash";

type TranslateFunction<T> = (strings: T) => string;
type TypedTranslator<T> = (accessor: TranslateFunction<T>) => string;

export function render(templateString: string, params: object): string {
  return template(templateString, { interpolate: /{{([\s\S]+?)}}/g })(params);
}

@Injectable({
  providedIn: "root"
})
export class TxService {
  // this will contain all the strings in hierarchical a.b... structure

  // IT'S OKAY TO READ FROM THIS IN APP CODE
  txs: any;

  instant(toTranslate: string): string {
    let got = get(this.txs, toTranslate);
    if (!got) {
      got = "Notrans: " + toTranslate;
    }

    return got;
  }
  setStrings(strings: any): void {
    // tip: uncomment to browse available strings
    // console.log("translations configured!", strings);
    this.txs = strings;
  }

  byFunc<TStrings>(accessor: TranslateFunction<TStrings>): string {
    try {
      return accessor(this.txs) || "UNTRANSLATED";
    } catch {
      return "UNTRANSLATED";
    }
  }

  make<TStrings>(): TypedTranslator<TStrings> {
    return this.byFunc.bind(this);
  }
}
