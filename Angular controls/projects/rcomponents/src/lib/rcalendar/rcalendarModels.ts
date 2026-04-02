import { ValidateProp, ValidateCustomTypeProp } from "../rvalidator";

export class Day {
    
    @ValidateProp("number")
    public num:number;
    
    @ValidateProp("number")
    public dayInWeek: number; 
    
    @ValidateProp("number")
    public Month: number; 
    
    @ValidateProp("number")
    public Year: number

    @ValidateProp("boolean")
    public isActiveMonth: boolean = false;

    @ValidateProp("label")
    public DayInString: string = "";

    @ValidateProp("boolean")
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

    @ValidateCustomTypeProp(Day)
    public days:Day[]

    constructor(_days:Day[]){
        this.days = _days;

        if(_days.length!=7){
           throw Error("invalid day");
        }
    }
}

export class Month {

    @ValidateCustomTypeProp(Week)
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