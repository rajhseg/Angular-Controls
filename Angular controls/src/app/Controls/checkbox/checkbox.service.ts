import { Injectable } from "@angular/core";
import { RCheckboxComponent } from "./checkbox.component";


@Injectable({
    providedIn:'root'
})
export class CheckboxService {
    private checkboxs: RCheckboxComponent[] = [];

    public AddInstance(obj: RCheckboxComponent){
        this.checkboxs.push(obj);
    }

    public ResetCheckboxesForGroup(groupname: string){
        let filtered = this.checkboxs.filter(x=>x.GroupName.toLowerCase()==groupname.toLowerCase());
        filtered.forEach(x=>{
            x.IsChecked = false;
        });
    }
}