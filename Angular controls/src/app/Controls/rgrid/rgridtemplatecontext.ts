import { RCell } from "./rcell";
import { RGridHeader } from "./rgrid.component";


export class RGridTemplateContext {
  
    public $implicit!: any;
      
    public CellInfo!: RCell;

    public Header!: RGridHeader;
  
  }