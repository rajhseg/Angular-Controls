import { isPlatformBrowser } from "@angular/common";
import { ChangeDetectorRef, Injectable, InjectionToken, PLATFORM_ID, inject } from "@angular/core";

export const WINDOWOBJECT = new InjectionToken<Window>('global window object', {
    factory:()=> {
        if(typeof window !== 'undefined') {
            return window;
        }
        return null as unknown as Window;
    }
});


export const RWINDOWHELPEROBJECT = new InjectionToken<RWindowHelper>('R Window Helper', {
    factory:()=> {
          return new RWindowHelper();
    }
});


@Injectable({
    providedIn:'root',
})
export class RWindowHelper {

    private isBrowser: boolean = false;
    private platformId = inject(PLATFORM_ID);    

    constructor() {

    }

    isExecuteInBrowser(): boolean{
        this.isBrowser = isPlatformBrowser(this.platformId)
        return this.isBrowser;
    }

    GenerateUniqueId(){
        
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return 'rid' + crypto.randomUUID().replace(/-/g,'');
        }

        return 'rid' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }  
    
    GetIntValueFromCssUnits(val: string): number {
        return parseInt(val.replace(/[^-\d\.]/g, ''));
    }

    GetUnitFromCssUnits(val: string): string {
        let result = val.replace(/[0-9,.]/g, '');
        return result;
    }
     
}

