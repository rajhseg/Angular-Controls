
import {  } from '@angular/compiler'
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppRootComponent } from './app/appb.component';
import { RootComponent } from './app/root-component/root.component';
import { LoadComponent } from './app/load/load.component';

bootstrapApplication(LoadComponent, appConfig)
  .catch((err) => console.error(err));
