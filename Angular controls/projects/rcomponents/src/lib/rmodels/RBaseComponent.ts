import { Directive, ElementRef, EventEmitter, HostBinding, inject, Injector, Input, NgZone, Optional, Output, Self } from "@angular/core";
import { RWindowHelper } from "../rwindowObject";
import { RSplitterType } from "../rsplitter/rpagecontent.directive";
import { filter, fromEvent, map, Observable, of, take } from "rxjs";
import { AbstractControl, AsyncValidator, NgControl, ValidationErrors, Validator, Validators } from "@angular/forms";

@Directive()
export abstract class RBaseComponent<T> implements AsyncValidator {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Output()
    valueChanged = new EventEmitter<T>();

    @Input()
    FontFamily: string = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    @Input()
    FontSize: string = '12px';

    @Input()
    ErrorIndicatorColor: string = "red";

    private _readonly: boolean = false;
    private _disabled: boolean | null = false;
    protected _formDisabled: boolean | null = false;
    
    private onValidatorChange?: () => void;

    @Input()
    set IsReadOnly(value: boolean) {
        this._readonly = value;
    }
    get IsReadOnly(): boolean {
        return this._readonly;
    }

    @Input()
    set IsDisabled(value: boolean | null) {
        this._disabled = value;
    }

    get IsDisabled(): boolean | null {
        return this._disabled || this._formDisabled;
    }

    @Input() required: boolean = false;
    @Input() email: boolean = false;
    @Input() min: number | Date | null = null;
    @Input() max: number | Date | null = null;
    @Input() minlength: number | null = null;
    @Input() maxlength: number | null = null;
    @Input() pattern: string | RegExp | null = null;
    @Input() asyncValidationFn?: (value: T) => Observable<ValidationErrors | null>;

    protected control: AbstractControl | null = null;
    protected ngControl: NgControl | null = null;
    protected baseinjector: Injector = inject(Injector);

    constructor(protected winObj: RWindowHelper) {
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();

        let ngZone = inject(NgZone);

        if(winObj.isExecuteInBrowser()) {
            ngZone.onStable
            .pipe(take(1))
            .subscribe(() => {
                const el = document.getElementById(this.HostElementId);
                if (el) {
                    this.onComponentLoadedInDom();
                }
            });
        }
    }

    protected getValue(): any {

    }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const syncErrors = this.getSyncErrors(control);
        if (this.asyncValidationFn) {
            return this.asyncValidationFn(this.getValue()).pipe(
                map(asyncErrors => {
                    if (asyncErrors) {
                        return { ...syncErrors, ...asyncErrors };
                    }
                    return syncErrors;
                })
            );
        } else {
            return of(syncErrors);
        }
    }

    protected getSyncErrors(control: AbstractControl): ValidationErrors | null {

        if(!this.IsValidatorSupported()) {
            return null;
        }

        const errors: ValidationErrors = {};
        const valType: ValidatorValueType = this.GetValidatorValueType();
        const val = this.getValue();

        const all: boolean = ValidatorValueType.Single == valType;

        const pattern: boolean = ValidatorValueType.Email == valType 
                                || ValidatorValueType.Color == valType 
                                || ValidatorValueType.Calender == valType;

        const array: boolean = ValidatorValueType.Array == valType;
        const grid: boolean = ValidatorValueType.Grid == valType;
        const range: boolean = ValidatorValueType.Range == valType 
                                || ValidatorValueType.Calender == valType;

        const checkbool: boolean = ValidatorValueType.Switch == valType;

        const onlyReq: boolean = ValidatorValueType.OnlyRequired == valType;

        if ((all || pattern || array || grid || range || checkbool || onlyReq) 
                && (this.required || control.hasValidator?.(Validators.required))) {
            if (val === null || val === undefined || val === '' || (array && val.length == 0)) {
                errors['required'] = true;
            }
        }

        if((all || valType == ValidatorValueType.Email) && this.email) {
            let emailError = Validators.email(val);
            if (emailError) {
                errors['email'] = true ;
            }
        }

        if ((all || range) && this.min != null && val != null && val < this.min) {
            errors['min'] = { min: this.min, actual: val };
        }

        if ((all || range) && this.max != null && val != null && val > this.max) {
            errors['max'] = { max: this.max, actual: val };
        }

        if ((all || array) && this.minlength != null && val?.length < this.minlength) {
            errors['minlength'] = {
                requiredLength: this.minlength,
                actualLength: val?.length || 0
            };
        }

        if ((all || array) && this.maxlength != null && val?.length > this.maxlength) {
            errors['maxlength'] = {
                requiredLength: this.maxlength,
                actualLength: val.length
            };
        }

        if ((all || pattern) && this.pattern && val != null) {
            const regex = typeof this.pattern === 'string'
                ? new RegExp(this.pattern)
                : this.pattern;

            if (!regex.test(val)) {
                errors['pattern'] = true;
            }
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }

    registerOnValidatorChange?(fn: () => void): void {
      this.onValidatorChange = fn;
    }

    protected IsValidatorSupported() : boolean {
        return false;
    }

    protected GetValidatorValueType(): ValidatorValueType {
        return ValidatorValueType.Single;
    }

    protected onComponentLoadedInDom() {
        
        this.ngControl = this.baseinjector.get(NgControl, null);

        if(this.ngControl) {
            this.ngControl.valueAccessor = this as any;
        }

        this.control = this.ngControl?.control ?? null;

        if (this.control) {
            this.control.addValidators(this.getSyncErrors.bind(this));
            this.control.addAsyncValidators(this.validate.bind(this));
            this.control.updateValueAndValidity({ emitEvent: false });
        }
    }

    ngOnChanges() {
      if (this.onValidatorChange) {
          this.onValidatorChange();
      }
  }
}

@Directive()
export abstract class RChartBaseComponent {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Input()
    FontFamily: string = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    @Input()
    FontSize: string = '12px';

    @Input()
    IsDisabled: boolean = false;
    
    constructor(protected winObj: RWindowHelper){
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }

}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}

export class RTimerResult {
    
    public Hour!: string;

    public Minute!: string;

    public Seconds!: string;

    constructor(_hour: string, _minute: string, _seconds: string) {
        this.Hour = _hour;
        this.Minute = _minute;
        this.Seconds = _seconds;
    }
}

export class RRangeSliderData {
    
    public FromValue: number | undefined = undefined;

    public ToValue: number | undefined = undefined;
    
    constructor(_fromValue: number | undefined, _toValue: number | undefined) {
        this.FromValue = _fromValue;
        this.ToValue = _toValue;
    }

}

export class RSplitterResult {

    SplitterType: RSplitterType = RSplitterType.Vertical;

    SplitterId: string = '';

    PreviousPanelSize: string = '';

    NextPanelSize: string = '';

    SplitterPosition: number = 0;

    PreviousPanelId: string = '';

    NextPanelId: string = '';

    constructor(_splitterId: string, _splitterType: RSplitterType, _previousPanelSize: string, _nextPanelSize: string,
         _splitterPosition: number, _previousPanelId: string, _nextPanelId: string
    ) {
        this.SplitterId = _splitterId;
        this.SplitterType = _splitterType;
        this.PreviousPanelSize = _previousPanelSize;
        this.NextPanelSize = _nextPanelSize;
        this.SplitterPosition = _splitterPosition;
        this.PreviousPanelId = _previousPanelId;
        this.NextPanelId = _nextPanelId;
    }
}

export enum ValidatorValueType {
    Single,
    Array,
    Email,
    Color,
    Calender,
    Range,
    Grid,
    Switch,
    OnlyRequired
}