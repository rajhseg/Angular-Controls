import { Directive, ElementRef } from "@angular/core";


@Directive({
    selector:'img[rimage]',
    standalone: true
})
export class RImageDirective {
    constructor(public element: ElementRef<HTMLImageElement>){
        
    }
}