

export class BarChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ){

    }
}


export enum SpaceBetweenBars {
    OneBar = 1,
    TwoBar = 2
}