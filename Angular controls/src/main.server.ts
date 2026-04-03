import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { AppRootComponent } from './app/appb.component';

const bootstrap = () => bootstrapApplication(AppRootComponent, config);

export default bootstrap;
