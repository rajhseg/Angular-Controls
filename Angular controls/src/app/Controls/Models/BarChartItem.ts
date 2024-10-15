

export class BarChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ) {

    }
}

export class ScatterChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: Graph[] = []) {

    }
}

export class Graph {
    constructor(public xPoint: number, public yPoint: number) {

    }
}

export class DrawTextItem {
    constructor(public value: string, public x: number, public y: number, public color: string) {

    }
}

export enum SpaceBetweenBars {
    OneBar = 1,
    TwoBar = 2
}