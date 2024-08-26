export class DropdownModel {
    public Value: any = {};
    public DisplayValue: string = '';
    public IsSelected: boolean = false;
    
    constructor(value:any, display:string){
        this.Value = value;
        this.DisplayValue = display;
    }
}