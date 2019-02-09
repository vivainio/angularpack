import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TxDirective } from "./tx.directive";
import { TxPipe } from "./tx.pipe";

@NgModule({
  imports: [CommonModule],
  declarations: [TxDirective, TxPipe],
  exports: [TxDirective, TxPipe]
})
export class TxModule {}
