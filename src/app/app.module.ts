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
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { DateRollerComponent } from './date-roller/date-roller.component'
import { NgScrollPickerModule } from "ng-scroll-picker";

import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TemplateComponent } from './template/template.component';

@NgModule({
  declarations: [AppComponent, DateRollerComponent, TemplateComponent],
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
    TableModule,
    NgScrollPickerModule,
    MatDialogModule,
  
	AngularEditorModule,
	HttpClientModule
  ],
  providers: [DialogService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
