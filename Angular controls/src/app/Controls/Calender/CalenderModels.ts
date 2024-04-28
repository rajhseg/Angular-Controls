
export class Day {
    
    public isActiveMonth: boolean = false;
    public DayInString: string = "";
    public isSelected: boolean =false;

    constructor(public num:number, public dayInWeek: number){
        this.DayInString = DaysEnum[dayInWeek];
    }

}

export class Week {
    constructor(public days:Day[]){
        if(days.length!=7){
           throw Error("invalid day");
        }
    }
}

export class Month {
    constructor(public weeks: Week[]){

    }
}

export enum DaysEnum {
    Sunday = 0,
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
}