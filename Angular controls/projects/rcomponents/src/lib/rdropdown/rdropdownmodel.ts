import { ValidateProp } from "../rvalidator";

export class DropdownModel {
    
    @ValidateProp("any")
    public Value: any = {};

    @ValidateProp("label")
    public DisplayValue: string = '';    
    
    constructor(value:any, display:string){
        this.Value = value;
        this.DisplayValue = display;
    }
}

export class DropDownItemModel extends DropdownModel {

    @ValidateProp("boolean")
    public IsSelected: boolean = false;
}