import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, inject, Input, Output, ViewChild } from '@angular/core';
import { RGrouppanelComponent } from "../rgrouppanel/rgrouppanel.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { RWindowHelper, WINDOWOBJECT } from '../rwindowObject';
import { RCloseService, IRDropDown } from '../rpopup.service';
import { CssUnit } from '../rcss-units.service';
import { RBaseComponent } from '../rmodels/RBaseComponent';

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
    
  },  
})
export class RfileuploadComponent extends RBaseComponent<FileList> implements IRDropDown, ControlValueAccessor {
  

  @ViewChild('rfile', { read: ElementRef }) rFile!: ElementRef;


  private _files!: FileList | undefined;

  public showFiles: boolean = false;

  public DisplayText: string = "";

  private _rFilesList: RFile[] = [];

  public get Files(): RFile[] {
    return this._rFilesList;
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

  @Input()
  SelectMultipleFiles: boolean = true;

  @Input()
  Accept: string = "";

  @Input()
  AllowedMaxFileSizeInMB : number = 1; // default 1 MB

  @Output()
  public filesSelected = new EventEmitter<FileList>();

  @Output()
  public filesCleared = new EventEmitter<any>();

  @ViewChild('openbtn', { read: ElementRef }) openBtn!: ElementRef;
  @ViewChild('startElement', { read: ElementRef }) startElement!: ElementRef;
  @ViewChild('dde', { read: ElementRef }) ddeElement!: ElementRef;

  onChanged: Function = ()=> {};
  onTouched: Function = ()=> {};

  DDEBottom: string = '';

  DDETop: string = '';

  DDELeft: string = '';

  DDERight: string = '';

  ErrorMessages: string[] = [];
  
  DDEWidth: string = '260px';

  DDEHeight: string = '150px';

  cls!: RCloseService;
  windowObj!: Window;

  constructor(private windowHelper: RWindowHelper, private eleRef: ElementRef, private cdr: ChangeDetectorRef){
    super(windowHelper);
    this.cls = RCloseService.GetInstance();
    this.dropdownId = windowHelper.GenerateUniqueId(); 
    this.Id = this.windowHelper.GenerateUniqueId();  
    this.cls.AddInstance(this);
    this.windowObj = inject(WINDOWOBJECT);
  }

  closeDropdown(): void {
    this.showFiles = false;
    this.cdr.detectChanges();
  }

  browse($event: Event) {
    (this.rFile.nativeElement as HTMLElement).click();
  }

  writeValue(obj: any): void {
    if(obj instanceof FileList){
      this._files = obj;

      this.populateFilesList(this._files);
      
      this.filesSelected.emit(this._files);
      this.valueChanged.emit(this._files);
      this.renderDisplayText();
    }
  }
  
  populateFilesList(files: FileList | undefined) {
    this._rFilesList = [];
    
    if (this._files != undefined) {
      for (let index = 0; index < this._files.length; index++) {
        const element = this._files[index];
        let eachFile = new RFile(element.name, element.size, element.type, element.lastModified);
        this._rFilesList.push(eachFile);
      }
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
    this._rFilesList = [];
    this.showFiles =false;
    this.rFile.nativeElement.value = "";
    this.DisplayText = "";
    this.ErrorMessages = [];

    this.onChanged(undefined);
    this.onTouched(undefined);
    this.filesSelected.emit(undefined);
    this.valueChanged.emit(undefined);
    this.filesCleared.emit($event);
  }
  

  onFilesSelected($event: Event) {

    this.ErrorMessages = [];
    this.DisplayText = '';

    this._files = ($event.target as any).files;

    let max_files_size = "";
    let exceed_size: boolean = false;
    let error_no = 0;

    if(this._files) {
      for (let index = 0; index < this._files.length; index++) {
        const element = this._files[index];
        const fileSize = element.size
        const fileSizeMB = fileSize / (1024 * 1024); // Size in MB
        if(fileSizeMB > this.AllowedMaxFileSizeInMB){
          exceed_size = true;
          error_no += 1;
          max_files_size = max_files_size+ error_no+ "." + element.name + ";\n "
          this.ErrorMessages.push(element.name);
        }
      }

      if(exceed_size){
        this._files = undefined; // clear files
        this._rFilesList = [];
        this.DisplayText = "Error";
        return;
      }
    }

    this.populateFilesList(this._files);

    this.onChanged(this._files);
    this.onTouched(this._files);
    this.filesSelected.emit(this._files);
    this.valueChanged.emit(this._files);
    this.renderDisplayText();    
  }

  renderDisplayText(){
    if (this._files != undefined) {

      if (this._files.length > 0) {
        this.DisplayText = "(" + (this._files.length) + ") files";
      } else{
        this.DisplayText = "";
        this.showFiles = false;
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

 formatSize(bytes: any, decimals: number = 2) {

    if (bytes === 0) return '0 Bytes';

    const b = 1024;
    const sizesinString = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const sizeindex = Math.floor(Math.log(bytes) / Math.log(b));

    return parseFloat((bytes / Math.pow(b, sizeindex)).toFixed(decimals)) + ' ' + sizesinString[sizeindex];
  }

  AttachDropdown() {
    let windowHeight = this.windowObj.innerHeight;

    if (this.openBtn.nativeElement) {

      const exp = /(-?[\d.]+)([a-z%]*)/;

      let btn = this.openBtn.nativeElement as HTMLElement;
      let dde = this.ddeElement.nativeElement as HTMLElement;

      let res = this.DDEHeight.match(exp);

      if (res) {
        let dropDownHeight = parseFloat(res[1].toString());
        let btnPosTop = btn.getBoundingClientRect().top;
        
        let isInTab = false;
        let element: HTMLElement | null = this.eleRef.nativeElement as HTMLElement;
        let tabTop, tabLeft;
        let i =15;

        let tabEle : any = undefined;

        while(element && element != null && i > 0){
          if(element.nodeName.toLowerCase() == 'rflattabs' || element.nodeName.toLowerCase() == 'rtabs'){
            isInTab = true;
            break;
          }
          
          i--;
          tabEle = element;
          element = element.parentElement;
        }

        if(isInTab && element) {
          let tabRect = tabEle.getBoundingClientRect();
          tabTop = tabRect.top;
          tabLeft = tabRect.left;
        } else {
          tabTop = 0;          
        }

        if (windowHeight - btnPosTop < dropDownHeight && tabTop - btnPosTop > dropDownHeight) {
          this.DDEBottom = '120%';
          this.DDETop = 'auto';
        } else {
          this.DDETop = '110%';
          this.DDEBottom = 'auto';
        }
      }

      let windowWidth = this.windowObj.innerWidth;
      if (this.startElement.nativeElement) {
        let start = this.startElement.nativeElement as HTMLElement;
        let res = this.DDEWidth.match(exp);

        if (res) {
          let dropDownWidth = parseFloat(res[1].toString());

          // dropDownWidth = dropDownWidth + padding(left, right) + border + margin;
          dropDownWidth = dropDownWidth + (10 * 2) + (1 * 2) + 0;

          let startPos = start.getBoundingClientRect();

          if (windowWidth > dropDownWidth + startPos.left) {
            this.DDELeft = '0px';
            this.DDERight = 'auto';
          } else {
            let moveRight = dropDownWidth - startPos.width;
            this.DDELeft = 'auto';

            if (moveRight > 0)
              this.DDERight = '0px';
          }
        }

      }
    }
  }

  windowOnClick($event: Event) {

    this.cls.PrintLog();

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
