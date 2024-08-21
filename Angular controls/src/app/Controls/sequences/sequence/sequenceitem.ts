import { Input } from "@angular/core";


export class RSequenceItem {

    public Value: object | string | number | undefined = undefined;

    public DisplayText: string = "";

    public IsLastItem: boolean = false;

    private _isactive: boolean = false;
    private _isPending: boolean = false;
    private _isCompleted: boolean = false;

    public set IsActive(value: boolean) {
        if (value) {
            this._isCompleted = false;
            this._isPending = false;
        }
        this._isactive = value;
    }
    public get IsActive(): boolean {
        return this._isactive;
    }

    public set IsCompleted(value: boolean) {
        if (value) {
            this._isactive = false;
            this._isPending = false;
        }
        this._isCompleted = value;
    }
    public get IsCompleted(): boolean {
        return this._isCompleted;
    }

    public set IsPending(value: boolean) {
        if (value) {
            this._isactive = false;
            this._isCompleted = false;
        }
        this._isPending = value;
    }
    public get IsPending(): boolean {
        return this._isPending;
    }
}