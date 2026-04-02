import { forwardRef, inject, Injectable } from "@angular/core";
import { RWindowHelper, RWINDOWHELPEROBJECT } from "../rwindowObject";
import { ValidateProp, ValidateCustomTypeProp } from "../rvalidator";


@Injectable({
    providedIn:'root'
})
export class RBaseChartItem {
    
    Id!: string;

    constructor() {
        this.Id = 'rid' + crypto.randomUUID().replace(/-/g,'');
    }
}

export class RGraph extends RBaseChartItem {
    
    @ValidateProp("number")
    public xPoint!: number;
     
    @ValidateProp("number")
    public yPoint!: number;

    constructor(_xPoint: number, _yPoint: number) {
        super();
        this.xPoint = _xPoint;
        this.yPoint = _yPoint;
    }
}

export class RBarChartItem extends RBaseChartItem {

    @ValidateProp("label")
    public DisplayName!: string;       
        
    @ValidateProp("numberarray")
    public Values!: number[];
        
    @ValidateProp("colororcolorarray")
    public barItemsBackColor!: string[] | string;
    
    @ValidateProp("colororcolorarray")
    public barItemsForeColor!: string[] | string;

    constructor(_displayName: string,         
         _values: number[],
         _barItemsBackColor: string[] | string,
         _barItemsForeColor: string[] | string
    ) {
        super();
        this.DisplayName = _displayName;
        this.Values = _values;
        this.barItemsBackColor = _barItemsBackColor;
        this.barItemsForeColor = _barItemsForeColor;
    }
}

export class RAllocationData extends RBaseChartItem {

    @ValidateProp("number")
    public Allocated!: number;
    
    @ValidateProp("number")
    public Spent!: number

    constructor(_allocated: number,  _spent: number) {
        super();
        this.Allocated = _allocated;
        this.Spent = _spent;
    }
}

export class RAllocatedBarChartItem extends RBaseChartItem {
    
    @ValidateProp('label')
    public DisplayName!: string;

    @ValidateCustomTypeProp(RAllocationData)
    public Values!: RAllocationData[];

    @ValidateProp("colororcolorarray")
    public barItemsBackColor!: string[] | string;

    @ValidateProp("colororcolorarray")
    public barItemsForeColor!: string[] | string;
    
    @ValidateProp("label")
    public AllocatedDisplayName!: string;

    @ValidateProp("label")
    public SpentDisplayName!: string;

    constructor(
         _displayName: string, 
         _values: RAllocationData[],
         _barItemsBackColor: string[] | string,
         _barItemsForeColor: string[] | string, 
         _allocatedDisplayName: string = 'Allocated',
         _spentDisplayName: string = 'Spent') {
            super();
            this.DisplayName = _displayName;
            this.Values = _values;
            this.barItemsBackColor = _barItemsBackColor;
            this.barItemsForeColor = _barItemsForeColor;
            this.AllocatedDisplayName = _allocatedDisplayName;
            this.SpentDisplayName = _spentDisplayName;
        }
}

export class RLineChartItem extends RBaseChartItem {

    @ValidateProp("label")
    public ItemName!: string; 
    
    @ValidateProp("color")
    public ItemColor!: string; 
    
    @ValidateProp("numberarray")
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RAreaChartItem extends RBaseChartItem {

    @ValidateProp("label")
    public ItemName!: string;
    
    @ValidateProp("color")
    public ItemColor!: string; 
    
    @ValidateProp("numberarray")
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();
        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RScatterChartItem extends RBaseChartItem {
        
    @ValidateProp("label")
    public ItemName!: string; 
    
    @ValidateProp("color")
    public ItemColor!: string; 
    
    @ValidateCustomTypeProp(RGraph)
    public Values!: RGraph[];

    constructor(_itemName: string, _itemColor: string, _values: RGraph[] = []) {
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RGraphSeriesChartItem extends RBaseChartItem {
       
    @ValidateProp("label")
    public ItemName!: string; 
    
    @ValidateProp("color")
    public ItemColor!: string; 
    
    @ValidateCustomTypeProp(RGraph)
    public Values!: RGraph[];

    constructor(_itemName: string, _itemColor: string, _values: RGraph[] = []) {
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}


export class RYSeriesChartItem extends RBaseChartItem {
    
    @ValidateProp("label")
    public ItemName!: string;
    
    @ValidateProp("color")
    public ItemColor!: string; 
    
    @ValidateProp("numberarray")
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();
        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}



export class RPopupChartItem extends RBaseChartItem {

    @ValidateProp("number")
    public x1!: number; 
    
    @ValidateProp("number")
    public y1!: number; 
    
    @ValidateProp("number")
    public x2!: number; 
    
    @ValidateProp("number")
    public y2!: number;

    @ValidateProp("any")
    public Item!: any; 
    
    @ValidateProp("number")
    public ValueIndex!: number;
     
    @ValidateProp("number")
    public ItemIndex!: number;
 
    @ValidateProp("color")
    public ItemColor!: string;

    constructor(_x1: number, _y1: number, _x2: number, _y2: number, 
         _item: any, _valueIndex: number, _itemIndex: number,
         _itemColor: string = 'gray'){
            
            super();

            this.Item = _item;
            this.ItemColor = _itemColor;
            this.ItemIndex = _itemIndex;
            this.ValueIndex = _valueIndex;
            this.x1 = _x1;
            this.x2 = _x2;
            this.y1 = _y1;
            this.y2 = _y2;
    }
}

export class RDrawTextItem extends RBaseChartItem {

    @ValidateProp("label")
    public value!: string; 
    
    @ValidateProp("number")
    public x!: number; 
    
    @ValidateProp("number")
    public y!: number;
     
    @ValidateProp("color")
    public color!: string; 
    
    @ValidateProp("boolean")
    public rotate!: boolean;

    constructor( _value: string,  _x: number,  _y: number,  _color: string,  _rotate: boolean = false) {
        super();

        this.color = _color;
        this.rotate = _rotate;
        this.value = _value;
        this.x = _x;
        this.y = _y;
    }
}

export enum RSpaceBetweenBars {
    OneBar = 1,
    TwoBar = 2
}