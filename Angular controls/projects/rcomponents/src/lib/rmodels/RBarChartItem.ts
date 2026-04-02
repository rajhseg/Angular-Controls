import { forwardRef, inject, Injectable } from "@angular/core";
import { RWindowHelper, RWINDOWHELPEROBJECT } from "../rwindowObject";


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
    
    public xPoint!: number;
     
    public yPoint!: number;

    constructor(_xPoint: number, _yPoint: number) {
        super();
        this.xPoint = _xPoint;
        this.yPoint = _yPoint;
    }
}

export class RBarChartItem extends RBaseChartItem {

    public DisplayName!: string;       
        
    public Values!: number[];
        
    public barItemsBackColor!: string[] | string;
    
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

    public Allocated!: number;
    
    public Spent!: number

    constructor(_allocated: number,  _spent: number) {
        super();
        this.Allocated = _allocated;
        this.Spent = _spent;
    }
}

export class RAllocatedBarChartItem extends RBaseChartItem {
    
    public DisplayName!: string;

    public Values!: RAllocationData[];

    public barItemsBackColor!: string[] | string;

    public barItemsForeColor!: string[] | string;
    
    public AllocatedDisplayName!: string;

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

    public ItemName!: string; 
    
    public ItemColor!: string; 
    
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RAreaChartItem extends RBaseChartItem {

    public ItemName!: string;
    
    public ItemColor!: string; 
    
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();
        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RScatterChartItem extends RBaseChartItem {
        
    public ItemName!: string; 
    
    public ItemColor!: string; 
    
    public Values!: RGraph[];

    constructor(_itemName: string, _itemColor: string, _values: RGraph[] = []) {
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}

export class RGraphSeriesChartItem extends RBaseChartItem {
       
    public ItemName!: string; 
    
    public ItemColor!: string; 
    
    public Values!: RGraph[];

    constructor(_itemName: string, _itemColor: string, _values: RGraph[] = []) {
        super();

        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}


export class RYSeriesChartItem extends RBaseChartItem {
    
    public ItemName!: string;
    
    public ItemColor!: string; 
    
    public Values!: number[];

    constructor(_itemName: string, _itemColor: string, _values: number[] = []){
        super();
        this.ItemName = _itemName;
        this.ItemColor = _itemColor;
        this.Values = _values;
    }
}



export class RPopupChartItem extends RBaseChartItem {

    public x1!: number; 
    
    public y1!: number; 
    
    public x2!: number; 
    
    public y2!: number;

    public Item!: any; 
    
    public ValueIndex!: number;
     
    public ItemIndex!: number;
 
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

    public value!: string; 
    
    public x!: number; 
    
    public y!: number;
     
    public color!: string; 
    
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