import { isPlatformBrowser } from "@angular/common";
import { ChangeDetectorRef, Injectable, InjectionToken, PLATFORM_ID, inject } from "@angular/core";

export const WINDOWOBJECT = new InjectionToken<Window>('global window object', {
    factory:()=> {
        if(typeof window !== 'undefined') {
            return window
          }
          return new Window();
    }
});

@Injectable({
    providedIn:'root',
})
export class WindowHelper {

    private isBrowser: boolean = false;
    private platformId = inject(PLATFORM_ID);    

    constructor() {

    }

    isExecuteInBrowser(): boolean{
        this.isBrowser = isPlatformBrowser(this.platformId)
        return this.isBrowser;
    }

    GenerateUniqueId(){
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }  
    
    GetIntValueFromCssUnits(val: string): number {
        return parseInt(val.replace(/[^-\d\.]/g, ''));
    }

    GetUnitFromCssUnits(val: string): string {
        let result = val.replace(/[0-9,.]/g, '');
        return result;
    }
     
}