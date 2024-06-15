import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import {
  Definition,
  Designer,
  RootEditorContext,
  Properties,
  Uid,
  Step,
  StepEditorContext,
  StepsConfiguration,
  ToolboxConfiguration,
  ValidatorConfiguration,
  BranchedStep,
} from 'sequential-workflow-designer';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { scheduled } from 'rxjs';

function createJob(): Step {
  return {
    id: Uid.next(),
    componentType: 'task',
    name: 'Job',
    type: 'job',
    properties: { testData: 0 },
  };
}

// function createIf(): BranchedStep {
//   return {
//     id: Uid.next(),
//     componentType: 'switch',
//     name: 'If',
//     type: 'if',
//     properties: { velocity: 10 },
//     branches: {
//       true: [],
//       false: [],
//     },
//   };
// }

function createMail(): Step {
  return {
    id: Uid.next(),
    componentType: 'task',
    name: 'Mail',
    type: 'Mail',
    properties: { mailFrom: '', scheduledTime: '', emailTemplate: '', },
  };
}

function createCall(): Step {
  return {
    id: Uid.next(),
    componentType: 'task',
    name: 'Call',
    type: 'Call',
    properties: { toMail: '', scheduled: '' },
  };
}

function createDefinition(): Definition {
  return {
    properties: {
      mailFrom: '',
      scheduledTime: '',
      emailTemplate: '',
      testData: 0,
    },
    sequence: [],
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  toggle: boolean = false;
  private designer?: Designer;
  public definition: Definition = createDefinition();
  public definitionJSON?: string;
  public selectedStepId: string | null = null;
  public isReadonly = false;
  public isToolboxCollapsed = false;
  public isEditorCollapsed = false;
  public isValid?: boolean;
  public visible: boolean = false;
  mailcontent: boolean = false;
  constructor(public dialogService: DialogService,private ngZone: NgZone,private cdr: ChangeDetectorRef, public messageService: MessageService) { }

  ref: DynamicDialogRef | undefined;
  ProductListDemo: any; 
  showModal: boolean = false;

  data = [{ scheduledDate: '05/07/23', scheduledTime: '09:30', eventDate: '05/07/23', eventTime: '06:30', event: 'Email Remainder 1 sent', isSuccess: true }, { scheduledDate: '06/12/23', scheduledTime: '11:30', eventDate: '', eventTime: '', event: 'Did Not Print Snail Mail', isSuccess: false }];
  templates: any = [{ name: 'First Follow Up', value: 0 }, { name: 'Second Follow Up', value: 0 }]
  public readonly toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      {
        name: 'Basic',
        steps: [createJob()],
      },
      {
        name: 'Advance',
        steps: [createMail(), createCall()],
      },
    ],
  };
  public readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: () => null,
  };
  // public readonly validatorConfiguration: ValidatorConfiguration = {
  //   step: (step: Step) =>
  //     !!step.name && Number(step.properties['testData']) >= 0,
  //   root: (definition: Definition) =>
  //     Number(definition.properties['testData']) >= 0,
  // };

  public ngOnInit() {
    this.updateDefinitionJSON();
    
  }

  public onDesignerReady(designer: Designer) {
    this.designer = designer;
    this.updateIsValid();
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateIsValid();
    this.updateDefinitionJSON();

  }

  public step: Step | null = null;
  public onSelectedStepIdChanged(stepId: string | null) {
    this.selectedStepId = stepId;
    // console.log(this.selectedStepId);
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
    // console.log(this.definitionJSON);
    const length = this.definition.sequence.length.valueOf();
    //console.log(this.definition.sequence.length.valueOf());
    this.visible = true;
    // for (let i = 0; i < length; i++) {
    //   if (this.definition.sequence[i].id === this.selectedStepId) {
    //     if (this.definition.sequence[i].name === 'Mail') {
    //       this.toggle = true;
    //     } else if (this.definition.sequence[i].name === 'Job') {
    //       this.toggle = false;
    //     }
    //   }
    // }
  }

  public onIsToolboxCollapsedChanged(isCollapsed: boolean) {
    this.isToolboxCollapsed = isCollapsed;
  }

  public onIsEditorCollapsedChanged(isCollapsed: boolean) {
    this.isEditorCollapsed = isCollapsed;
  }

  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(
    properties: Properties,
    name: string,
    event: Event,
    context: RootEditorContext | StepEditorContext
  ) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  public reloadDefinitionClicked() {
    this.definition = createDefinition();
    this.updateDefinitionJSON();
  }

  public toggleReadonlyClicked() {
    this.isReadonly = !this.isReadonly;
  }

  public toggleSelectedStepClicked() {
    if (this.selectedStepId) {
      this.selectedStepId = null;
    } else if (this.definition.sequence.length > 0) {
      this.selectedStepId = this.definition.sequence[0].id;
    }
  }

  public toggleToolboxClicked() {
    this.isToolboxCollapsed = !this.isToolboxCollapsed;
  }

  public toggleEditorClicked() {
    this.isEditorCollapsed = !this.isEditorCollapsed;
  }

  private updateDefinitionJSON() {
    this.ngZone.run(() => {
      this.definitionJSON = JSON.stringify(this.definition, null, 2);
      this.cdr.detectChanges();
    })
   
  }

  private updateIsValid() {
    this.isValid = this.designer?.isValid();
  }

  public toggleSelectedStepClicked1() {
    if (this.selectedStepId) {
      this.selectedStepId = null;
    } else if (this.definition.sequence.length > 0) {
      this.selectedStepId = this.definition.sequence[0].id;
    }
  }


  closeModal() {
    this.mailcontent = false;
  }



  show() {
    this.ref = this.dialogService.open(this.ProductListDemo, {
      header: 'Select a Product',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((product: any) => {
      if (product) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  events = [
    {
      status: '18 Jun 2023',
      date: '10:00 AM EDT',
      icon: 'fa-solid fa-envelope-open text-2xl',
      icon1: 'hidden',
      icon2: 'hidden',
      color: '#7EC607',
      bgcolors: 'demo_green',
      image: 'assets/img/cadence_email_icon.svg',
    },
    // {
    //   status: '18 Jun 2023',
    //   date: '10:00 AM EDT',
    //   icon: 'fa-solid fa-envelope-open text-2xl',
    //   icon1: 'hidden',
    //   icon2: 'hidden',
    //   color: '#7EC607',
    //   bgcolors: 'demo_green',
    //   image: 'assets/img/cadence_email_icon.svg',
    // },
    // {
    //   status: 'Shipped',
    //   date: '15/10/2020 16:15',
    //   icon: 'fa-solid fa-envelope text-2xl',
    //   icon1: 'hidden',
    //   icon2: 'hidden',
    //   color: '#E9573E',
    //   bgcolors: 'demo_red',
    //   image: 'assets/img/cadence_emailred_icon.svg',
    // },
    // {
    //   status: 'Delivered',
    //   date: '16/10/2020 10:00',
    //   icon: 'fa-solid fa-phone-volume text-2xl',
    //   icon1: 'hidden',
    //   icon2: 'hidden',
    //   color: '#8E8F8E',
    //   bgcolors: 'demo_gray',
    //   image: 'assets/img/cadence_phone_icon.svg',
    //   image2: 'assets/img/cadence_phone_icon.svg',
    //   image3: 'assets/img/cadence_phone_icon.svg',
    // },
    // {
    //   status: 'Delivered',
    //   date: '16/10/2020 10:00',
    //   icon: 'fa-solid fa-envelope-open-text text-2xl',
    //   icon1: 'fa-solid fa-message text-2xl',
    //   icon2: 'fa-solid fa-envelope text-2xl',
    //   color: '#8E8F8E',
    //   bgcolors: 'demo_gray',
    //   image: 'assets/img/cadence_phone_icon.svg',
    // },
    // {
    //   status: 'Delivered',
    //   date: '16/10/2020 10:00',
    //   icon: 'fa-solid fa-envelope text-2xl',
    //   icon1: 'hidden',
    //   icon2: 'hidden',
    //   color: '#8E8F8E',
    //   bgcolors: 'demo_gray',
    //   image: 'assets/img/cadence_phone_icon.svg',
    // },
  ];

  showFullMail(){

  }
}
