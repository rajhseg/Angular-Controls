import { ApplicationConfig, EnvironmentProviders, forwardRef, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic'

import { NgModule, COMPILER_OPTIONS, Compiler, CompilerFactory} from '@angular/core'
import { environment } from '../environments/environment.development';
import { provideAnimations } from '@angular/platform-browser/animations';

export function createCompiler(factory:CompilerFactory){
  return factory.createCompiler();
}


const provider1: (Provider | EnvironmentProviders)[] = [provideRouter(routes), provideClientHydration(),
  {provide: COMPILER_OPTIONS, useValue:{}, multi: true},
  {provide: CompilerFactory, useClass: JitCompilerFactory, deps:[COMPILER_OPTIONS]},
  {provide:Compiler, useFactory: createCompiler, deps:[CompilerFactory]}
]

const provider2: (Provider | EnvironmentProviders)[] = [
  provideRouter(routes), 
  provideClientHydration(),    
]

export const appConfig: ApplicationConfig = {
  providers: provider2
};
