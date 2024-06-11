import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    SequentialWorkflowDesignerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
