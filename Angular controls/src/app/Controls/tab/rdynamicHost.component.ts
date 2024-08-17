import { AfterContentInit, AfterViewInit, Compiler, Component, ComponentFactoryResolver, ContentChildren, ElementRef, Inject, Injector, NgModule, OnInit, Optional, Output, output, QueryList, TemplateRef, Type, ViewChild, ViewChildren, ViewContainerRef } from "@angular/core";
import { RTabComponent } from "./tab.component";
import { NgTemplateOutlet } from "@angular/common";
import { AppComponent } from "../../app.component";

@Component({
    selector:'rdynamic-host',
    template:`<ng-template #dynamicContainer></ng-template>`,    
    standalone: true
})
export class RDynamicHostComponent implements OnInit, AfterContentInit, AfterViewInit {
    
    @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
    
    public afterContentLoad = output<any[]>();
   
    constructor(
        private cfr: ComponentFactoryResolver,
        private compiler: Compiler,
        private injector: Injector
      ) {
        
      }
        
    ngAfterViewInit(): void {
      
    }

    ngAfterContentInit(): void {    
    }
    
    ngOnInit(): void {
        
    }

    createDynamicComponent(html: string, parentInstanceOrContext: object, returnType: Type<any> | string, directiveInputs: any, importsForThisComponent: any[]) {              
      const componentClass = this.createComponent(html, parentInstanceOrContext, returnType, directiveInputs, importsForThisComponent);
      const factory = this.cfr.resolveComponentFactory(componentClass);
      this.container.clear();

console.log('Component Type');
console.log(componentClass);

      const parentInjector = Injector.create({
        providers: [
          { provide: 'PARENT', useValue: parentInstanceOrContext }
        ],
        parent: this.injector
      });

      const componentRef = this.container.createComponent(factory, 0, parentInjector);    
      
      // (componentRef.instance as any).afterContentLoad.subscribe((x: any)=>{          
      //   this.afterContentLoad.emit(x);
      // });
      
      return componentRef;
    }
    
    private createComponent(val: string, parentInstanceOrContext:object, returnType: Type<any> | string, directiveInputs: any, importsForThisComponent: any[]): any {
        
        // let _template = '<ng-template #tpl>'+val+'{{starWidth}}</ng-template><ng-container #vc></ng-container>'
        // let importDir = [];   
      
        // console.log(_template);

        // if(returnType)
        //   importDir.push(returnType); 
        
        // for (let index = 0; index < importsForThisComponent.length; index++) {
        // const element = importsForThisComponent[index];
        // importDir.push(element);
        // }

        // @Component({
        //   selector: 'dynamic-component',
        //   template: _template,
        //   imports:[importDir, NgTemplateOutlet]          
        // })
        // class DynamicComponent implements AfterContentInit, AfterViewInit {

        //   public context: object = parentInstanceOrContext;
        //   public afterContentLoad = output<any[]>();
   
        //   @ViewChild('tpl', {read: TemplateRef}) tpl!: TemplateRef<any>;
        //   @ViewChild('vc', {read: ViewContainerRef}) vc!: ViewContainerRef;
        
        //   constructor(@Optional() @Inject('PARENT') parent: object={}){

        //     this.context = parent;

        //     // Parent instance need to be pass by reference context is missing            
        //     // Object.assign(this, parentInstanceOrContext);            
            
        //     // Object.getOwnPropertyNames(Object.getPrototypeOf(parentInstanceOrContext))
        //     // .filter(prop => typeof (parentInstanceOrContext as any)[prop] === 'function' && prop !== 'constructor')
        //     // .forEach(method => {
        //     //   (this as any)[method] = (parentInstanceOrContext as any)[method].bind(parentInstanceOrContext);
        //     // }); 

        //   }

        //   ngAfterViewInit(): void {            
        //     this.vc.createEmbeddedView(this.tpl, {$implicit: parentInstanceOrContext});
        //     setTimeout(() => {
        //       if (this.tabs) {                
        //         this.afterContentLoad.emit(this.tabs.toArray());                
        //       }              
        //     });
        //   }

        //   ngAfterContentInit(): void {
            
        //   }

        //   @ViewChildren(returnType,{read: returnType}) tabs!: QueryList<any>;

        //  }

        // @NgModule({
        //   declarations: [DynamicComponent],
        //   imports: [importDir, NgTemplateOutlet],
        //   bootstrap: [DynamicComponent]
        // })
        // class DynamicModule {}
    
        // const moduleFactory = this.compiler.compileModuleSync(DynamicModule);         
        // const moduleRef = moduleFactory.create(this.injector);
    
        // const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(DynamicComponent);                
        
        // return componentFactory.componentType;

        return {};
    }
}