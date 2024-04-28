export class DropdownModel {
    public Value: any = {};
    public DisplayValue: string = '';
    constructor(value:any, display:string){
        this.Value = value;
        this.DisplayValue = display;
    }
}