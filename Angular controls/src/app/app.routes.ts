import { Routes } from '@angular/router';
import { AppRootComponent } from './appb.component';
import { DefaultComponent } from './default.component';
import { StaticShowcaseComponent } from './static-showcase/static-showcase.component';

export const routes: Routes = [
    {
        path:'',
        component: StaticShowcaseComponent
    },
    {
        path:'default',
        component:DefaultComponent
    },
    {
        path:'root',
        component:AppRootComponent
    }
];

