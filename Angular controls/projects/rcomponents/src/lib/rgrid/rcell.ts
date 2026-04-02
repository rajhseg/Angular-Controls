
import { Directive, EventEmitter, inject } from "@angular/core";
import { RColumnComponent } from "./rcolumn/rcolumn.component";
import { RGridComponent, RGridHeader } from "./rgrid.component";

export class RCell {

    public component!: RGridComponent;
  
    private _value: object | undefined = undefined;

    public columnDirective!: RColumnComponent;

    public Row: number | undefined = undefined;

    public Column: number | undefined = undefined;

    public DisplayRow: number | undefined = undefined;

    public DisplayColumn: number | undefined = undefined;

    public Width!: string;

    public Height!: string;

    public FromModel: boolean = false;

    public set Value(data: object | undefined) {

        let _validData = data;

        this._value = _validData;

        if (this.Item) {
            this.Item[this.HeaderKey] = _validData;

            let props = this.HeaderKey.split(".");
            if (props.length > 1) {
                let _obj = undefined;
                let _fobj = this.Item;

                for (let index = 0; index < props.length - 1; index++) {
                    const _p = props[index];
                    _fobj = _fobj[_p];
                    if (_fobj == undefined)
                        break;

                    _obj = _fobj;
                }

                _obj[props[props.length - 1]] = _validData;
            }            

            if(!this.FromModel) {
                this.updateActualModel(_validData);
                this.component.NotifyToModel(this)                
            }                
        } else {
            
            if(this.HeaderKey=='')
                this.IsValueUpdated = true;
        }
    }
    public get Value(): object | undefined {
        return this._value;
    }

    private updateActualModel(data: any){        
        
        let _item = this.component.Items[this.Row as any];        

        if (_item) {
            
            let props = this.HeaderKey.split(".");
                        
            if (props.length > 1) {
                let _obj = undefined;
                let _fobj = _item;

                for (let index = 0; index < props.length - 1; index++) {
                    const _p = props[index];
                    _fobj = _fobj[_p];
                    if (_fobj == undefined)
                        break;

                    _obj = _fobj;
                }

                _obj[props[props.length - 1]] = data;

            } else {                
                _item[this.HeaderKey] = data;
            }  
            
            this.IsValueUpdated = true;
       }
    }

    public HeaderIndex: number = -1;

    public Item: any | undefined = undefined;

    private _isEditmode : boolean = false;

    public set IsEditMode(value: boolean){

        if(value ) {
            if(typeof this._value === 'string' && this._value != undefined) {
                 
            }
        } else {
            if(this._isEditmode== true && value==false) {
               
            }
        }

        this._isEditmode = value;
    } 
    public get IsEditMode(): boolean {
        return this._isEditmode;
    }

    public HeaderKey: string = "";

    public IsValueUpdated: boolean = false;

    constructor() {

    }

}

export class RCellInfo {

  public Component!: RGridComponent;

  public Value: object | undefined = undefined;

  public ColumnComponentInfo!: RColumnComponentInfo;

  public DisplayRow: number | undefined = undefined;

  public DisplayColumn: number | undefined = undefined;

  public Width!: string;

  public Height!: string;

  public FromModel: boolean = false;

  public HeaderIndex: number = -1;

  public Item: any | undefined = undefined;

  public IsEditMode: boolean = false;

  public HeaderKey: string = "";
}

export class RColumnComponentInfo {
  
  Name: string = "";

  PropToBindToCellInfo: string = "";

  IsDummyPropToBind: boolean = false;

  DisableGrouping: boolean = false;

  IsComputationalColumn: boolean = false;

  HeaderText: string = "";

  Height: string = "auto";

  Width: string = "auto";

  DisableSort: boolean = false;

  DisableFilter: boolean = false;
}

export class RGridRow {
    [Columns: string | number]: RCell;
}

export class RGridRowInfo {
  [Columns: string | number]: RCellInfo
}

export class RGridItems {

    public Rows: RGridRow[] = [];
}

export enum RGridHeaderSortType {
    Descending = -1,
    Ascending = 1
}

export class RGridHeaderSort {
    constructor(public SortType: RGridHeaderSortType | undefined, public Header: RGridHeader) {

    }
}

export class RGridEditRowInfo {
    constructor(public RowIndex: number){

    }
}

export class RGridPaginationValue {

    public CurrentPage: number;
    
    public RowsPerPage: number;
     
    public TotalPagesInGrid: number;

    public TotalRows: number; 
    
    public RowsInCurrentPage: number;

    constructor( _currentPage: number, _rowsPerPage: number, _totalPagesInGrid: number, 
        _totalRows: number,  _rowsInCurrentPage: number){
            this.CurrentPage = _currentPage;
            this.RowsInCurrentPage = _rowsInCurrentPage;
            this.RowsPerPage = _rowsPerPage;
            this.TotalPagesInGrid = _totalPagesInGrid;
            this.TotalRows = _totalRows;
    }
}
