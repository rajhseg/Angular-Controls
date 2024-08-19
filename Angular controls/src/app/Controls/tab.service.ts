import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactory, Directive, ElementRef, inject, Injectable, Injector, Renderer2, ViewContainerRef } from "@angular/core";
import { RTabsComponent } from "./tab/rtabs.component";

@Injectable({
    providedIn:'root'
})
export class RTabService {

private render: Renderer2 = inject(Renderer2);

private static instance: RTabService | undefined = undefined;

private constructor(private appRef: ApplicationRef){

}

public static GetInstance(): RTabService {
    
    if(this.instance==undefined){
        let _appRef = inject(ApplicationRef);
        this.instance = new RTabService(_appRef);
    }

    return this.instance;
}

private elements: RTabsComponent[] = [];
private commonParentElement: HTMLElement | undefined = undefined;

AddTabsInstance(instance: RTabsComponent){
    this.elements.push(instance);
    console.log("tab service host element");
    console.log(this.render);
    console.log(instance.hostElementRef);
    this.SetCommonParentElement(instance.hostElementRef.nativeElement)
}

SetCommonParentElement(newElement: HTMLElement) {

    if(this.commonParentElement==undefined){
     this.commonParentElement = newElement;   
     return;
    }
    
    let parent: HTMLElement | null = this.commonParentElement;
    let childParent : HTMLElement | null = newElement;
    let commonnode: HTMLElement | null = null;

    while(parent!=null){

        childParent = newElement;

        while(childParent!=null){
            if(childParent.isEqualNode(parent)){
                commonnode = parent;
                break;
            }

            childParent = childParent.parentElement;
        }

        if(commonnode!=null){
            break;
        }

        parent = parent.parentElement;
    }

    if(commonnode!=null){
        this.commonParentElement = commonnode;        
        this.render.setAttribute(this.commonParentElement, "cdkDropListGroup", "");               

        // let appRef = inject(ApplicationRef);
        // let injector = inject(Injector);
        // let factory = inject(ResolveFactory);

        // let projectNodes = [Array.prototype.slice.call(this.commonParentElement.parentElement?.childNodes)];
        // let _comp =    factory.cf.create(injector, projectNodes, this.commonParentElement.parentElement);
        // this.appRef.attachView(_comp.hostView);

        let cdr = inject(ChangeDetectorRef);
        cdr.markForCheck();
        console.log('common parent');
        console.log(this.commonParentElement);
    }
    
    }

}

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
        console.log(":body");
    }
}