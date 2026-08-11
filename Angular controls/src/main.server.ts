import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { AppRootComponent } from './app/appb.component';
import { RootComponent } from './app/root-component/root.component';

const bootstrap = () => bootstrapApplication(RootComponent, config);

export default bootstrap;
