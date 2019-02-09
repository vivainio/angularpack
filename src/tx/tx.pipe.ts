import { Pipe, PipeTransform } from "@angular/core";
import { TxService } from "./tx.service";

@Pipe({ name: "ptTx" })
export class TxPipe implements PipeTransform {
  constructor(private txService: TxService) {}

  transform(value: string, ...args: any[]) {
    return this.txService.instant(value);
  }
}
