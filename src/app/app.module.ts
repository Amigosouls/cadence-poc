import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
	declarations: [AppComponent],
	imports: [
		CommonModule,
		BrowserModule,
    BrowserAnimationsModule,
		SequentialWorkflowDesignerModule,
		NoopAnimationsModule,
		MatTabsModule,
		MatInputModule,
		MatButtonModule,
		DialogModule,
		InputTextModule,
		CalendarModule,
		FormsModule,
		DropdownModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}