import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { RGrouppanelComponent } from "../grouppanel/grouppanel.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';

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
  ]
})
export class RfileuploadComponent implements ControlValueAccessor {
  

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
      }
    }
  }

  toggle($event: Event) {
    this.showFiles = !this.showFiles;
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