import { NgStyle } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rgroup-panel',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './grouppanel.component.html',
  styleUrl: './grouppanel.component.css'
})
export class RGrouppanelComponent {

@Input()
public EnableShadowEffect: boolean = false;

@Input()
groupname: string = "";

@Input()
IsItemsArrangeHorizontal: boolean = false;

@Input()
TitleForeColor: string = "gray";

Id: string = '';

@HostBinding('id')
HostElementId: string = this.windowHelper.GenerateUniqueId();

constructor(private windowHelper: WindowHelper){
  this.Id = this.windowHelper.GenerateUniqueId();
}

}
