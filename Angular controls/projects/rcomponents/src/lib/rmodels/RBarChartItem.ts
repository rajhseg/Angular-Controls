import { inject, Injectable } from "@angular/core";
import { RWindowHelper, RWINDOWHELPEROBJECT } from "../rwindowObject";


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
    
    constructor(
        public DisplayName: string, 
        public Values: RAllocationData[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string, 
        public AllocatedDisplayName: string = 'Allocated',
        public SpentDisplayName: string = 'Spent') {
            super();
        }
}

export class RAllocationData extends RBaseChartItem {
    constructor(public Allocated: number, public Spent: number) {
        super();
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