
export class RBarChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ) {

    }
}

export class RAllocatedBarChartItem {
    constructor(
        public DisplayName: string, 
        public Values: RAllocationData[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string, 
        public AllocatedDisplayName: string = 'Allocated',
        public SpentDisplayName: string = 'Spent') {

        }
}

export class RAllocationData {
    constructor(public Allocated: number, public Spent: number) {

    }
}
export class RLineChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){

    }
}

export class RAreaChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){

    }
}

export class RScatterChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: RGraph[] = []) {

    }
}

export class RGraphSeriesChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: RGraph[] = []) {

    }
}


export class RYSeriesChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []) {

    }
}


export class RGraph {
    constructor(public xPoint: number, public yPoint: number) {

    }
}

export class RPopupChartItem {
    constructor(public x1: number, public y1: number, public x2: number, public y2: number, 
        public Item: any, public ValueIndex: number, public ItemIndex: number,
        public ItemColor: string = 'gray'){

    }
}

export class RDrawTextItem {
    constructor(public value: string, public x: number, public y: number, public color: string, public rotate: boolean = false) {

    }
}

export enum RSpaceBetweenBars {
    OneBar = 1,
    TwoBar = 2
}