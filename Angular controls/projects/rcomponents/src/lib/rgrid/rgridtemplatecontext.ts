import { RCell } from "./rcell";
import { RGridHeader } from "./rgrid.component";


export class RGridTemplateContext {
  
    public $implicit!: any;
      
    public CellInfo!: RCell;

    public Header!: RGridHeader;
  
  }

  
export class RGridHeaderTemplateContext {
  
  public $implicit!: any;    

  public Header!: RGridHeader;

}