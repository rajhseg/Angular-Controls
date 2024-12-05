import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { RGrouppanelComponent } from "../grouppanel/grouppanel.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { WindowHelper } from '../windowObject';
import { CloseService, IDropDown } from '../popup.service';

@Component({
  selector: 'rfileupload',
  standalone: true,
  imports: [RGrouppanelComponent, NgClass, NgIf, NgForOf, NgStyle],
  templateUrl: './rfileupload.component.html',
  styleUrl: './rfileupload.component.css',
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=>RfileuploadComponent),
      multi: true
    }
  ],
  host: {
    "(window:click)": "windowOnClick($event)"
  }
})
export class RfileuploadComponent implements IDropDown, ControlValueAccessor {
  

  @ViewChild('rfile', { read: ElementRef }) rFile!: ElementRef;


  private _files!: FileList | undefined;

  public showFiles: boolean = false;

  public DisplayText: string = "";

  public get Files(): RFile[] {
    let Rfiles = [];

    if (this._files != undefined) {
      for (let index = 0; index < this._files.length; index++) {
        const element = this._files[index];
        let eachFile = new RFile(element.name, element.size, element.type, element.lastModified);
        Rfiles.push(eachFile);
      }
    }

    return Rfiles;
  }

  public dropdownId: string = "";

  @Input()
  ParentDropDownId: string = '';

  @Input()
  IconForeColor: string = "blue";

  @Input()
  ShowFilesAsDropdownContainer: boolean = false;
  
  @Input()
  TextForeColor: string = "gray";

  @Input()
  public EnableShadowEffect: boolean = true;
  
  @Input()
  ShowFilesListMaximumHeight: string = "150px";

  @Input()
  EnableMaximumHeightForShowFiles: boolean = false;

  @Output()
  public filesSelected = new EventEmitter<FileList>();

  @Output()
  public filesCleared = new EventEmitter<any>();

  onChanged: Function = ()=> {};
  onTouched: Function = ()=> {};

  Id: string = '';
  
  @HostBinding('id')
  HostElementId: string = this.windowHelper.GenerateUniqueId();

  cls!: CloseService;

  constructor(private windowHelper: WindowHelper){
    this.cls = CloseService.GetInstance();
    this.dropdownId = windowHelper.GenerateUniqueId(); 
    this.Id = this.windowHelper.GenerateUniqueId();  
    this.cls.AddInstance(this);
  }

  closeDropdown(): void {
    this.showFiles = true;
  }

  browse($event: Event) {
    (this.rFile.nativeElement as HTMLElement).click();
  }

  writeValue(obj: any): void {
    if(obj instanceof FileList){
      this._files = obj;
      this.filesSelected.emit(this._files);
      this.renderDisplayText();
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChanged= fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  clear($event: Event) {
    this._files = undefined;
    this.showFiles =false;
    this.rFile.nativeElement.value = "";
    this.DisplayText = "";

    this.onChanged(undefined);
    this.onTouched(undefined);
    this.filesSelected.emit(undefined);
    this.filesCleared.emit($event);
  }
  

  onFilesSelected($event: Event) {
    this._files = ($event.target as any).files;
    this.onChanged(this._files);
    this.onTouched(this._files);
    this.filesSelected.emit(this._files);
    this.renderDisplayText();    
  }

  renderDisplayText(){
    if (this._files != undefined) {
      if (this._files.length > 0) {
        this.DisplayText = "(" + (this._files.length) + ") files";
      } else{
        this.DisplayText ="";
      }
    }
  }

  toggle($event: Event) { 
    $event.stopPropagation();
    $event.preventDefault();
   
    this.showFiles = !this.showFiles;

    if(this.showFiles){
      this.cls.CloseAllPopups(this);
    }
        
  }


  windowOnClick($event: Event) {

    if (this.showFiles) {
      let i = 15;
      let element = $event.srcElement;
      let sameelementClicked: boolean = false;
      let elementId: string | undefined = undefined;

      while (element != undefined && i > -1) {
        if ((element as HTMLElement).classList.contains('rfileuploaddropdownclose')) {
          elementId = (element as HTMLElement).id;
          if (elementId == this.dropdownId) {
            sameelementClicked = true;
          }
          break;
        }

        i--;
        element = (element as HTMLElement).parentElement;
      }

      if (!sameelementClicked)
        this.showFiles = false;
    }
  }

  
  IsOpen(): boolean {
    return this.showFiles;
  }

}

export class RFile {
  constructor(
    public name: string,
    public size: number,
    public type: string,
    public lastModified: number
  ) { }
}