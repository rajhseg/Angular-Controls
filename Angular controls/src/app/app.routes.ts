import { Routes } from '@angular/router';
import { AppRootComponent } from './appb.component';
import { DefaultComponent } from './default.component';

export const routes: Routes = [
    {
        path:'',
        component: AppRootComponent
    },
    {
        path:'default',
        component:DefaultComponent
    }
];
