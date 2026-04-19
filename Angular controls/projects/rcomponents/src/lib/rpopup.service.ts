import { Injectable } from '@angular/core';
import { DropdownService } from './rdropdown/rdropdownservice.service';
import { RCalenderService } from './rcalendar/rcalendar.service';

@Injectable({
  providedIn: 'root'
})
export class RPopupService {

  private list: string[] = [];
  private windowClickElementIds: string[] = [];

  constructor(private dropdownService: DropdownService, private calendarService: RCalenderService) { }
  
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
  
  CloseAllCalender(instance: IRPopupCloseInterface | null){
    this.calendarService.GetAllInstance().forEach((x)=>{      
      if(x!==instance && x!=instance?.ParentComponent) {
         x.IsCalenderOpen = false; 
      }
    });

  }

  CloseAllDropdown(instance: IRPopupCloseInterface | null){
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


export interface IRPopupCloseInterface {
  IsChildOfAnotherControl: boolean;
  ParentComponent:any | undefined;
  IsChildOfAnotherControlClicked: boolean;
}

export interface IRDropDown {
  Id: string;
  ParentDropDownId: string;
  closeDropdown(): void;
  IsOpen(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RCloseService {

  private static inc:number = 0;

  private static ins: RCloseService | undefined;

  private objects: IRDropDown[] = [];

  public static GetInstance(): RCloseService {
    if(this.ins==null || this.ins==undefined){
      this.ins = new RCloseService();
    }

    return this.ins;
  }

  PrintLog(){
    RCloseService.inc = RCloseService.inc + 1;
  }

  AddInstance(ins: IRDropDown){
    if(this.objects.find(x=>x.Id.toLowerCase()==ins.Id.toLowerCase())==undefined){
      this.objects.push(ins);  
    }
  }

  RemoveInstance(ins: IRDropDown) {
    let _index = this.objects.findIndex(x=> x == ins);
    if(_index > -1){
      this.objects.splice(_index, 1);
    }
  }

  CloseAllPopups(currentDropdown: IRDropDown | undefined): void{
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
        
    let i = 15;
    let element = $event.srcElement;
    let sameelementClicked: boolean = false;
    let elementId: string | undefined = undefined;

    while (element != undefined && i > -1) {
      if ((element as HTMLElement).classList.contains('rfilterclose') 
          || (element as HTMLElement).classList.contains('rtimeselectorwindowclose')
          || (element as HTMLElement).classList.contains('rselectdropdownWindowClose')
          ||  (element as HTMLElement).classList.contains('rcolorpickerwindowclose')
          || (element as HTMLElement).classList.contains('rdropdownWindowClose')
          || (element as HTMLElement).classList.contains('rcalenderWindowsClose')
          ||(element as HTMLElement).classList.contains('fileuploadclose')) {
        elementId = (element as HTMLElement).id;        
        sameelementClicked = true;        
        break;
      }

      i--;
      element = (element as HTMLElement).parentElement;
    }

    if (!sameelementClicked)
      RCloseService.GetInstance().CloseAllPopups(undefined);    
  }
  
  if(typeof window !== 'undefined')
    window.addEventListener('click', DropDownClose);

})();