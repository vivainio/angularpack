import { TestBed } from "@angular/core/testing";

import { TxService, render } from "./tx.service";

interface MyStrings {
  a: { b: string };
}

describe("TxService", () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [TxService] }));

  it("should be created", () => {
    const service: TxService = TestBed.get(TxService);
    expect(service).toBeTruthy();
    service.byFunc<MyStrings>(e => e.a.b);

    const tt = service.make<MyStrings>();

    tt(s => s.a.b);
  });

  it("should support string interpolation", () => {
    const service: TxService = TestBed.get(TxService);
    const txs: MyStrings = {
      a: {
        b: "{{count}} items"
      }
    };
    service.txs = txs;

    const tt = service.make<MyStrings>();
    const translation = render(tt(s => s.a.b), { count: 5 });
    const translation2 = render(service.instant("a.b"), { count: 5 });
    expect(translation).toBe("5 items");
    expect(translation2).toBe("5 items");
  });

  it("should return UNTRANSLATED when translation missing", () => {
    const service: TxService = TestBed.get(TxService);
    const translation = service.byFunc<MyStrings>(s => s.a.b);
    expect(translation).toBe("UNTRANSLATED");
  });
});
