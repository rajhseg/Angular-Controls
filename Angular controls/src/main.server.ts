import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { AppRootComponent } from './app/appb.component';
import { RootComponent } from './app/root-component/root.component';
import { LoadComponent } from './app/load/load.component';

const bootstrap = () => bootstrapApplication(LoadComponent, config);

export default bootstrap;
