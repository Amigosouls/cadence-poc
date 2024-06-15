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
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

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
		DropdownModule,
		TimelineModule,
		CardModule,
		OverlayPanelModule,
		TableModule
	],
	providers: [DialogService, MessageService],
	bootstrap: [AppComponent]
})
export class AppModule {}