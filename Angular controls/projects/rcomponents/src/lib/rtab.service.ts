import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactory, Directive, ElementRef, inject, Injectable, Injector, Renderer2, ViewContainerRef } from "@angular/core";
import { RTabsComponent } from "./rtab/rtabs.component";


@Injectable()
export class ResolveFactory{
    constructor(public cf: ComponentFactory<any>){ }
}

@Directive({
    selector:'[body]',
    standalone: true,
    hostDirectives:[]
})
export class BodyDirective{
    constructor(private elementRef: ElementRef){
        
    }
}