import { Injectable } from "@angular/core";
import { RRadiobuttonComponent } from "./radiobutton.component";

@Injectable({
    providedIn:'root'
})
export class RadioButtonService {
    private radiobtns: RRadiobuttonComponent[] = [];

    public AddInstance(obj: RRadiobuttonComponent){
        this.radiobtns.push(obj);
    }

    public ResetRadioButtonsForGroup(groupname: string){
        let filtered = this.radiobtns.filter(x=>x.GroupName.toLowerCase()==groupname.toLowerCase());
        filtered.forEach(x=>{
            x.IsChecked = false;
            x.emitValueToUI();
        });
    }
}