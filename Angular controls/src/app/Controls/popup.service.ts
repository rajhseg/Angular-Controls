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