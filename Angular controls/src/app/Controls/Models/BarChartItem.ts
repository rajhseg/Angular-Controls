

export class BarChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ){

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