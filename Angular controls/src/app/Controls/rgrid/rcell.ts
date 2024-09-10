
import { RColumnComponent } from "./rcolumn/rcolumn.component";
import { RGridHeader } from "./rgrid.component";


export class RCell {

    private _value: object | undefined = undefined;

    public columnDirective!: RColumnComponent;

    public Row: Number | undefined = undefined;

    public Column: Number | undefined = undefined;

    public Width!: string;

    public Height!: string;

    public set Value(data: object | undefined) {
        this._value = data;

        if (this.Item) {
            this.Item[this.HeaderKey] = data;

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

                _obj[props[props.length - 1]] = data;
            }

            console.log("item");
            console.log(this.Item);
        }
    }
    public get Value(): object | undefined {
        return this._value;
    }

    public HeaderIndex: number = -1;

    public Item: any | undefined = undefined;

    public IsEditMode: boolean = false;

    public HeaderKey: string = "";

}

export class RGridRow {
    [Columns: string | number]: RCell;
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