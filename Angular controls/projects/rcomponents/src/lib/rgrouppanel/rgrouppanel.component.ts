import { NgStyle } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { RWindowHelper } from '../rwindowObject';

@Component({
  selector: 'rgroup-panel',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './rgrouppanel.component.html',
  styleUrl: './rgrouppanel.component.css'
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
HostElementId: string = '';

constructor(private windowHelper: RWindowHelper){
  this.Id = this.windowHelper.GenerateUniqueId();
  this.HostElementId = this.windowHelper.GenerateUniqueId();
}

}
