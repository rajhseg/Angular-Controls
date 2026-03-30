import { inject, Injectable } from "@angular/core";
import { RWindowHelper, RWINDOWHELPEROBJECT } from "../rwindowObject";
import { ValidateInput } from "../Validator";


@Injectable({
    providedIn:'root'
})
export class RBaseChartItem {
    
    Id!: string;

    constructor() {
        this.Id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

export class RBarChartItem extends RBaseChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ) {
        super();
    }
}

export class RAllocatedBarChartItem extends RBaseChartItem {
    
    @ValidateInput('label')
    public DisplayName!: string;

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

export class RLineChartItem extends RBaseChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){
        super();
    }
}

export class RAreaChartItem extends RBaseChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){
        super();
    }
}

export class RScatterChartItem extends RBaseChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: RGraph[] = []) {
        super();
    }
}

export class RGraphSeriesChartItem extends RBaseChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: RGraph[] = []) {
        super();
    }
}


export class RYSeriesChartItem extends RBaseChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []) {
        super();
    }
}


export class RGraph extends RBaseChartItem {
    constructor(public xPoint: number, public yPoint: number) {
        super();
    }
}

export class RPopupChartItem extends RBaseChartItem {
    constructor(public x1: number, public y1: number, public x2: number, public y2: number, 
        public Item: any, public ValueIndex: number, public ItemIndex: number,
        public ItemColor: string = 'gray'){
            super();
    }
}

export class RDrawTextItem extends RBaseChartItem {
    constructor(public value: string, public x: number, public y: number, public color: string, public rotate: boolean = false) {
        super();
    }
}

export enum RSpaceBetweenBars {
    OneBar = 1,
    TwoBar = 2
}