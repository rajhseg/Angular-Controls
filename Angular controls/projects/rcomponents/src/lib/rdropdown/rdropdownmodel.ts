import { ValidateInput } from "../Validator";

export class DropdownModel {
    
    @ValidateInput("any")
    public Value: any = {};

    @ValidateInput("label")
    public DisplayValue: string = '';    
    
    constructor(value:any, display:string){
        this.Value = value;
        this.DisplayValue = display;
    }
}

export class DropDownItemModel extends DropdownModel {

    @ValidateInput("boolean")
    public IsSelected: boolean = false;
}