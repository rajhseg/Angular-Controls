import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'rgroup-panel',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './grouppanel.component.html',
  styleUrl: './grouppanel.component.css'
})
export class RGrouppanelComponent {

@Input()
groupname: string = "";

@Input()
IsItemsArrangeHorizontal: boolean = false;

@Input()
TitleForeColor: string = "gray";

}
