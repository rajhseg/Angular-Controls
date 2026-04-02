
export class Day {
    
    public num:number;
    
    public dayInWeek: number; 
    
    public Month: number; 
    
    public Year: number

    public isActiveMonth: boolean = false;

    public DayInString: string = "";

    public isSelected: boolean =false;

    constructor(_num:number, _dayInWeek: number, _Month: number, _Year: number){
        this.num = _num;
        this.dayInWeek = _dayInWeek;
        this.Month = _Month;
        this.Year = _Year;
        this.DayInString = DaysEnum[_dayInWeek];
    }

}

export class Week {

    public days:Day[]

    constructor(_days:Day[]){
        this.days = _days;

        if(_days.length!=7){
           throw Error("invalid day");
        }
    }
}

export class Month {

    public weeks: Week[]

    constructor(_weeks: Week[]){
        this.weeks = _weeks;
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