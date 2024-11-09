

export class BarChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ) {

    }
}

export class AllocatedBarChartItem {
    constructor(
        public DisplayName: string, 
        public Values: AllocationData[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string, 
        public AllocatedDisplayName: string = 'Allocated',
        public SpentDisplayName: string = 'Spent') {

        }
}

export class AllocationData {
    constructor(public Allocated: number, public Spent: number) {

    }
}
export class LineChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){

    }
}

export class AreaChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){

    }
}

export class ScatterChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: Graph[] = []) {

    }
}

export class GraphSeriesChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: Graph[] = []) {

    }
}


export class YSeriesChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []) {

    }
}


export class Graph {
    constructor(public xPoint: number, public yPoint: number) {

    }
}

export class PopupChartItem {
    constructor(public x1: number, public y1: number, public x2: number, public y2: number, 
        public Item: any, public ValueIndex: number, public ItemIndex: number,
        public ItemColor: string = 'gray'){

    }
}

export class DrawTextItem {
    constructor(public value: string, public x: number, public y: number, public color: string, public rotate: boolean = false) {

    }
}

export enum SpaceBetweenBars {
    OneBar = 1,
    TwoBar = 2
}