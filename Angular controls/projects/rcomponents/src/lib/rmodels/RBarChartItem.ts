import { forwardRef, inject, Injectable } from "@angular/core";
import { RWindowHelper, RWINDOWHELPEROBJECT } from "../rwindowObject";
import { ValidateInput, ValidateCustomTypeInput } from "../Validator";


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
    
    @ValidateInput("number")
    public xPoint!: number;
     
    @ValidateInput("number")
    public yPoint!: number;

    constructor(_xPoint: number, _yPoint: number) {
        super();
        this.xPoint = _xPoint;
        this.yPoint = _yPoint;
    }
}

export class RBarChartItem extends RBaseChartItem {

    @ValidateInput("label")
    public DisplayName!: string;       
        
    @ValidateInput("numberarray")
    public Values!: number[];
        
    @ValidateInput("colororcolorarray")
    public barItemsBackColor!: string[] | string;
    
    @ValidateInput("colororcolorarray")
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

    @ValidateInput("number")
    public Allocated!: number;
    
    @ValidateInput("number")
    public Spent!: number

    constructor(_allocated: number,  _spent: number) {
        super();
        this.Allocated = _allocated;
        this.Spent = _spent;
    }
}

export class RAllocatedBarChartItem extends RBaseChartItem {
    
    @ValidateInput('label')
    public DisplayName!: string;

    @ValidateCustomTypeInput(RAllocationData)
    public Values!: RAllocationData[];

    @ValidateInput("colororcolorarray")
    public barItemsBackColor!: string[] | string;

    @ValidateInput("colororcolorarray")
    public barItemsForeColor!: string[] | string;
    
    @ValidateInput("label")
    public AllocatedDisplayName!: string;

    @ValidateInput("label")
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

    @ValidateInput("label")
    public ItemName!: string; 
    
    @ValidateInput("color")
    public ItemColor!: string; 
    
    @ValidateInput("numberarray")
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RAreaChartItem extends RBaseChartItem {

    @ValidateInput("label")
    public ItemName!: string;
    
    @ValidateInput("color")
    public ItemColor!: string; 
    
    @ValidateInput("numberarray")
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();
        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RScatterChartItem extends RBaseChartItem {
        
    @ValidateInput("label")
    public ItemName!: string; 
    
    @ValidateInput("color")
    public ItemColor!: string; 
    
    @ValidateCustomTypeInput(RGraph)
    public Values!: RGraph[];

    constructor(_itemName: string, _itemColor: string, _values: RGraph[] = []) {
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RGraphSeriesChartItem extends RBaseChartItem {
       
    @ValidateInput("label")
    public ItemName!: string; 
    
    @ValidateInput("color")
    public ItemColor!: string; 
    
    @ValidateCustomTypeInput(RGraph)
    public Values!: RGraph[];

    constructor(_itemName: string, _itemColor: string, _values: RGraph[] = []) {
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}


export class RYSeriesChartItem extends RBaseChartItem {
    
    @ValidateInput("label")
    public ItemName!: string;
    
    @ValidateInput("color")
    public ItemColor!: string; 
    
    @ValidateInput("numberarray")
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();
        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}



export class RPopupChartItem extends RBaseChartItem {

    @ValidateInput("number")
    public x1!: number; 
    
    @ValidateInput("number")
    public y1!: number; 
    
    @ValidateInput("number")
    public x2!: number; 
    
    @ValidateInput("number")
    public y2!: number;

    @ValidateInput("any")
    public Item!: any; 
    
    @ValidateInput("number")
    public ValueIndex!: number;
     
    @ValidateInput("number")
    public ItemIndex!: number;
 
    @ValidateInput("color")
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

    @ValidateInput("label")
    public value!: string; 
    
    @ValidateInput("number")
    public x!: number; 
    
    @ValidateInput("number")
    public y!: number;
     
    @ValidateInput("color")
    public color!: string; 
    
    @ValidateInput("boolean")
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