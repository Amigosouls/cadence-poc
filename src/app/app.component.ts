import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
    properties: { mailFrom: '', scheduledTime: '', emailTemplate: '' },
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
      runBasedOn : '',
      
    },
    sequence: [],
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

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
  cursorPosition: any;
  constructor(
    public dialogService: DialogService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public messageService: MessageService
  ) {}

  ref: DynamicDialogRef | undefined;
  ProductListDemo: any;
  showModal: boolean = false;

  data = [
    {
      scheduledDate: '05/07/23',
      scheduledTime: '09:30',
      eventDate: '05/07/23',
      eventTime: '06:30',
      event: 'Email Remainder 1 sent',
      isSuccess: true,
    },
    {
      scheduledDate: '06/12/23',
      scheduledTime: '11:30',
      eventDate: '',
      eventTime: '',
      event: 'Did Not Print Snail Mail',
      isSuccess: false,
    },
  ];
  templates: any = [
    { name: 'First Follow Up', value: 0 },
    { name: 'Second Follow Up', value: 0 },
  ];
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
    iconUrlProvider: (componentType: string, type: string) => {
      if (componentType === 'task') {
        switch (type) {
          case 'Mail':
            return './assets/mail.png';
          case 'Call':
            return './assets/call.jpg';
        }
      }
      return './assets/angular-icon.svg';
    },
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
    console.log(this.definition.sequence);
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
    this.changeStepColor();

   
  }

  private changeStepColor(){
    var elements = document.querySelectorAll('.sqd-step-task') as NodeListOf<Element>;;
    var matchedElement:any = null;

    // Loop through each element
    elements.forEach((element:Element) => {
        // Check if the element has the data-step-id attribute
        if (element.hasAttribute('data-step-id')) {
            // Get the value of the data-step-id attribute
            var stepId = element.getAttribute('data-step-id');

            // Compare the attribute value with the provided ID value
            if (stepId === this.selectedStepId) {
                matchedElement = element; // Found the matching element
                return; // Exit the loop early since we found the match
            }
        }
    });

    if (matchedElement) {
        var rectElement = matchedElement.querySelector('rect') as HTMLElement;
        // console.log(matchedElement)
        // console.log(elements)
        // console.log(rectElement)
        // Check if the <rect> element was found
        if (rectElement) {
            // Change the style fill to aqua
            console.log(this.selectedStepId)
            console.log(rectElement)
            if(this.isValid){
              rectElement.style.fill = 'green';
            } // Use setAttribute to change SVG fill
            else{
              rectElement.style.fill = 'red';
            }
        }
    }
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
    console.log(this.definition.sequence.length);
    this.ref = this.dialogService.open(this.ProductListDemo, {
      header: 'Select a Product',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });

    this.ref.onClose.subscribe((product: any) => {
      if (product) {
        this.messageService.add({
          severity: 'info',
          summary: 'Product Selected',
          detail: product.name,
        });
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Maximized',
        detail: `maximized: ${value.maximized}`,
      });
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

  showFullMail() {}

  toggleCheckbox(event: any) {
    this.toggle = !this.toggle;
    console.log(event.target.checked);
  }

  onDragStart(event: any, content: string) {
    event.dataTransfer.setData('text', content);
  }

  onEditorFocus(event: any) {
    this.cursorPosition = event.target.selectionStart;
  }

  onEditorBlur(event: any) {
    this.cursorPosition = null;
  }
}
