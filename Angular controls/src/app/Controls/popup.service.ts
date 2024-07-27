import { Injectable } from '@angular/core';
import { DropdownService } from './dropdown/dropdownservice.service';
import { CalenderService } from './Calender/calender.service';
import { DropdownComponent } from './dropdown/dropdown.component';
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
  
  CloseCalender(instance: any){
    this.calendarService.GetAllInstance().forEach((x)=>{      
      if(x!==instance) {
         x.IsCalenderOpen = false; 
      }
    });

  }

  CloseDropdown(instance: IPopupCloseInterface | null, onWindowClick: boolean){
    this.dropdownService.GetAllInstance().forEach((x)=>{        
      x.IsDropDownOpen = false;           
    });
  }

  ClosePopupsOnWindowsClick(instance: IPopupCloseInterface | null, onWindowClick: boolean){
    
    if(instance!=null && instance!=undefined){
      if(instance.IsChildOfAnotherControl){

        if(instance instanceof DropdownComponent)
            this.CloseDropdown(instance, onWindowClick);

        if(instance instanceof CalenderComponent)
            this.CloseCalender(instance);
          
        return;
      }
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
  
    this.CloseCalender(instance);
 
    this.CloseDropdown(instance, onWindowClick);
  }
}


export interface IPopupCloseInterface {
  IsChildOfAnotherControl: boolean;
  ParentComponent:any | undefined;
  IsChildOfAnotherControlClicked: boolean;
}