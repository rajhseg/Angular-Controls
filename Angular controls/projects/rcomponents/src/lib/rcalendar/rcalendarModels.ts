import { ValidateInput, ValidateInputType } from "../Validator";

export class Day {
    
    @ValidateInput("number")
    public num:number;
    
    @ValidateInput("number")
    public dayInWeek: number; 
    
    @ValidateInput("number")
    public Month: number; 
    
    @ValidateInput("number")
    public Year: number

    @ValidateInput("boolean")
    public isActiveMonth: boolean = false;

    @ValidateInput("label")
    public DayInString: string = "";

    @ValidateInput("boolean")
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

    @ValidateInputType(Day)
    public days:Day[]

    constructor(_days:Day[]){
        this.days = _days;

        if(_days.length!=7){
           throw Error("invalid day");
        }
    }
}

export class Month {

    @ValidateInputType(Week)
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