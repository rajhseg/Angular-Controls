import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RGrouppanelComponent } from "../grouppanel/grouppanel.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rfileupload',
  standalone: true,
  imports: [RGrouppanelComponent, NgClass, NgIf, NgForOf, NgStyle],
  templateUrl: './rfileupload.component.html',
  styleUrl: './rfileupload.component.css',
})
export class RfileuploadComponent {

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
  TextForeColor: string = "gray";

  @Output()
  public filesSelected = new EventEmitter<FileList>();

  @Output()
  public filesCleared = new EventEmitter<any>();

  browse($event: Event) {
    (this.rFile.nativeElement as HTMLElement).click();
  }

  clear($event: Event) {
    this._files = undefined;
    this.showFiles =false;
    this.rFile.nativeElement.value = "";
    this.DisplayText = "";
    this.filesCleared.emit($event);
  }

  onFilesSelected($event: Event) {
    this._files = ($event.target as any).files;
    this.filesSelected.emit(this._files);

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