import { Injectable } from '@angular/core';
import { DropdownService } from './dropdown/dropdownservice.service';
import { CalenderService } from './Calender/calender.service';
import { RDropdownComponent } from './dropdown/dropdown.component';
import { CalenderComponent } from './Calender/calender.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private list: string[] = [];
  private windowClickElementIds: string[] = [];

  constructor(private dropdownService: DropdownService, private calendarService: CalenderService) { }
  
  AddPopupModalClassName(classname: string){
    this.list.push(classname);
  }

  AddWindowClickToComponent(id: string){
    if(id){
      this.windowClickElementIds.push(id);
    }
  }

  CanAddWindowClickToComponent(id: string): boolean {
    let index = this.windowClickElementIds.findIndex(x=>x==id);

    if(index==-1){      
      return true;
    }
    else{
      return false;
    }
  }
  
  CloseAllCalender(instance: IPopupCloseInterface | null){
    this.calendarService.GetAllInstance().forEach((x)=>{      
      if(x!==instance && x!=instance?.ParentComponent) {
         x.IsCalenderOpen = false; 
      }
    });

  }

  CloseAllDropdown(instance: IPopupCloseInterface | null){
    this.dropdownService.GetAllInstance().forEach((x)=>{ 
      if(x!=instance && x!=instance?.ParentComponent)  {     
          x.IsDropDownOpen = false;      
      }     
    });
  }

  CloseAllPopupsOnOpen(currentInstance: any | null){
    
    if(currentInstance!=null && currentInstance!=undefined){              
        this.CloseAllDropdown(currentInstance);        
        this.CloseAllCalender(currentInstance);                    
    }

    this.list.forEach(element => {
      let drps = document.querySelectorAll('.'+element);

      drps.forEach((x)=>{
        if(x.classList.contains('show'))
          {
            x.classList.toggle('show');
          }
      });
    
    });  
  }
}


export interface IPopupCloseInterface {
  IsChildOfAnotherControl: boolean;
  ParentComponent:any | undefined;
  IsChildOfAnotherControlClicked: boolean;
}

export interface IDropDown {
  Id: string;
  ParentDropDownId: string;
  closeDropdown(): void;
  IsOpen(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CloseService {

  private static ins: CloseService | undefined;

  private objects: IDropDown[] = [];

  public static GetInstance(): CloseService {
    if(this.ins==null || this.ins==undefined){
      this.ins = new CloseService();
    }

    return this.ins;
  }

  AddInstance(ins: IDropDown){
    if(this.objects.find(x=>x.Id.toLowerCase()==ins.Id.toLowerCase())==undefined){
      this.objects.push(ins);  
    }
  }

  CloseAllPopups(currentDropdown: IDropDown | undefined): void{
    let noCloseList = [];

    if(currentDropdown!=undefined){
      noCloseList.push(currentDropdown.Id);
      let parentDropdownId = currentDropdown.ParentDropDownId;

      while(parentDropdownId!=undefined && parentDropdownId!=null && parentDropdownId.trim()!=''){
        let parIns = this.objects.find(x=>x.Id.toLowerCase()==parentDropdownId.toLowerCase());
        if(parIns!=undefined){
          noCloseList.push(parIns.Id);
          parentDropdownId = parIns.ParentDropDownId;
        }
        else {
          parentDropdownId = '';
        }
      }
    }

    let openedDrops = this.objects.filter(x=>x.IsOpen()==true);

    for (let index = 0; index < openedDrops.length; index++) {
      const element = openedDrops[index];
      let indx = noCloseList.find(x=>x.toLowerCase()==element.Id.toLowerCase());
      if(indx==undefined || indx==null){
        element.closeDropdown();
      }
    }
  }

}

(function(){

  function DropDownClose($event: any){
    
  }
  
  if(typeof window !== 'undefined')
    window.addEventListener('click', DropDownClose);

})();