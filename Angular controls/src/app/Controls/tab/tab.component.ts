import { AfterContentInit, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, output, QueryList } from '@angular/core';
import { RTabHeaderComponent } from './tabheader/tabheader.component';
import { AsyncPipe, NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';
import { RTabContentComponent } from './tabcontent/tabcontent.component';

@Component({
  selector: 'rtab',
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgClass, RTabContentComponent, RTabHeaderComponent],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class RTabComponent implements AfterContentInit {

  @Input({ required: true, alias:'TabId'}) TabId = '';

  @ContentChild(RTabHeaderComponent) tabHeader!: RTabHeaderComponent;

  @ContentChild(RTabContentComponent) tabContent!: RTabContentComponent;

  IsComponentLoaded: boolean = false;

  @Output()
  TabMounted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(){
  }

  ngAfterContentInit(): void {
    if(this.tabHeader){
      this.tabHeader.TabHeaderComponentMounted.subscribe(x=> {
        if(x){
          this.renderUI();
        }
      });
    }

    if(this.tabContent){
      this.tabContent.TabContentComponentMounted.subscribe(x=>{
        if(x){
          this.renderUI();
        }
      });
    }
  }

  renderUI(){
    if(this.tabHeader.IsComponentLoaded && this.tabContent.IsComponentLoaded){
      this.IsComponentLoaded = true;
      this.TabMounted.emit(this.IsComponentLoaded);
    }
  }
}


