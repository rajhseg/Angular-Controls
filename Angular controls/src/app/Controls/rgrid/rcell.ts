
import { RColumnComponent } from "./rcolumn/rcolumn.component";


export class RCell {    

    private _value: object | undefined = undefined;

    public columnDirective!: RColumnComponent;

    public Row: Number | undefined = undefined;

    public Column: Number | undefined = undefined;

    public Width!: string;

    public Height!: string;

    public set Value(data: object|undefined){
        this._value = data;
        
        if(this.Item)
            this.Item[this.HeaderKey] = data;        
    }
    public get Value(): object | undefined {
        return this._value;
    }

    public HeaderIndex: number = -1;    
    
    public Item: any | undefined = undefined;

    public IsEditMode: boolean = false;

    public HeaderKey: string ="";

}

export class RGridRow {
     [Columns : string | number]: RCell;     
}

export class RGridItems{
    public Rows: RGridRow[] = [];
}