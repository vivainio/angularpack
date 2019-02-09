import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { TxService } from "./tx.service";

@Directive({
  selector: "[ptTx]"
})
export class TxDirective implements OnInit {
  @Input("ptTx") ptTx: string;
  constructor(private el: ElementRef, private tx: TxService) {}

  ngOnInit() {
    this.el.nativeElement.textContent = this.tx.instant(this.ptTx);
  }
}
