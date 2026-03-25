import { Injectable } from "@angular/core";
import { RCheckboxComponent } from "./rcheckbox.component";


@Injectable({
    providedIn:'root'
})
export class CheckboxService {
    private checkboxs: RCheckboxComponent[] = [];

    public AddInstance(obj: RCheckboxComponent){
        this.checkboxs.push(obj);
    }

    public ResetCheckboxesForGroup($event: Event | undefined, groupname: string, instance: RCheckboxComponent) {
        let filtered = this.checkboxs.filter(x=>x.GroupName.toLowerCase()==groupname.toLowerCase() && x != instance);
        filtered.forEach(x=>{
            x.IsChecked = false;
            x.emitValueToModel($event);
        });
    }
}


export class CheckboxEventArgs {
    constructor(public event: Event | undefined, public isChecked:boolean) {

    }
}