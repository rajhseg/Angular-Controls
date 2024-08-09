import { AfterContentInit, AfterViewInit, Compiler, Component, ComponentFactoryResolver, ContentChildren, ElementRef, Injector, NgModule, OnInit, Output, output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from "@angular/core";
import { RTabComponent } from "./tab.component";

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
      // const componentClass = this.createComponent(html, parentInstanceOrContext, returnType, directiveInputs, importsForThisComponent);
      // const factory = this.cfr.resolveComponentFactory(componentClass);
      // this.container.clear();

      // const componentRef = this.container.createComponent(factory);            
      
      // (componentRef.instance as any).afterContentLoad.subscribe((x: any)=>{                                           
      //   this.afterContentLoad.emit(x);
      // });
      
      // return componentRef;

      return { 
        afterContentLoad: {
          subscribe:(x:any)=>{ }
          }
        };
    }
    
    private createComponent(val: string, parentInstanceOrContext:object, returnType: Type<any> | string, directiveInputs: any, importsForThisComponent: any[]): any {
        
      /*
          
        let importDir = [];   

        if(returnType)
          importDir.push(returnType); 
        
        for (let index = 0; index < importsForThisComponent.length; index++) {
        const element = importsForThisComponent[index];
        importDir.push(element);
        }

        @Component({
          selector: 'dynamic-component',
          template: val,
          imports:[importDir]          
        })
        class DynamicComponent implements AfterContentInit, AfterViewInit {

          public afterContentLoad = output<any[]>();
   
          constructor(){

            // Parent instance need to be pass by reference context is missing            
            Object.assign(this, parentInstanceOrContext);            
            
            Object.getOwnPropertyNames(Object.getPrototypeOf(parentInstanceOrContext))
            .filter(prop => typeof (parentInstanceOrContext as any)[prop] === 'function' && prop !== 'constructor')
            .forEach(method => {
              (this as any)[method] = (parentInstanceOrContext as any)[method].bind(parentInstanceOrContext);
            }); 

          }

          ngAfterViewInit(): void {
            setTimeout(() => {
              if (this.tabs) {                
                this.afterContentLoad.emit(this.tabs.toArray());                
              }              
            });
          }

          ngAfterContentInit(): void {
            
          }

          @ViewChildren(returnType) tabs!: QueryList<any>;

         }

        @NgModule({
          declarations: [DynamicComponent],
          imports: importDir,
          bootstrap: [DynamicComponent]
        })
        class DynamicModule {}
    
        const moduleFactory = this.compiler.compileModuleSync(DynamicModule);         
        const moduleRef = moduleFactory.create(this.injector);
    
        const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(DynamicComponent);
        
        return componentFactory.componentType;

        */

        return {instance:{}};
    }
}