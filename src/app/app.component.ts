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
  Editor,
} from 'sequential-workflow-designer';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { scheduled } from 'rxjs';
import {
  PickerDataModel,
  PickerResponseModel,
  PickerValueModel,
} from 'ng-scroll-picker';

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
    properties: { FromEmail: '', Days: '',Minute:'' ,Hour: '', RunBasedOn: '', ToEmail: '',MailTemplateId:'' ,CcEmail:'',BccEmail:'',IsAttachInvoicePdf:null,IsAttachInvoiceDocuments:null,ScheduledTime:'',isValid: false },
  };
}

function createCall(): Step {
  return {
    id: Uid.next(),
    componentType: 'task',
    name: 'Call',
    type: 'Call',
    properties: { toMail: '', scheduled: '', isValid: false },
  };
}

function createDefinition(): Definition {
  return {
    properties: {
      CadenceName:'',
      
    },
    sequence: [],
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

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

  selectedStep: any = {};

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
  stepName: string = '';
  mailcontent: boolean = false;
  cursorPosition: any;
  selectedDaysValue: any;
  selectedHoursValue: any;
  selectedBasedOnValue: any;
  print:any;

  data: PickerDataModel[] = [
    {
      textAlign: 'start',
      weight: 9,
      className: undefined,
      onClick: (gIndex: any, iIndex: any, selectedDaysValue: any) => {
        console.log('selectedDaysValue', selectedDaysValue);
      },
      currentIndex: 0,
      list: [],
      divider: false,
      text: 'test',
      groupName: 'test',
    },
  ];
  hours: PickerDataModel[] = [
    {
      textAlign: 'start',
      weight: 9,
      className: undefined,
      onClick: (gIndex: any, iIndex: any, selectedHoursValue: any) => {
        console.log('selectedHoursValue', selectedHoursValue);
      },
      currentIndex: 0,
      list: [],
      divider: false,
      text: 'test',
      groupName: 'test',
    },
  ];
  basedon: PickerDataModel[] = [
    {
      textAlign: 'start',
      weight: 9,
      className: undefined,
      onClick: (gIndex: any, iIndex: any, selectedBasedOnValue: any) => {
        console.log('selectedBasedOnValue', selectedBasedOnValue);
      },
      currentIndex: 0,
      list: [],
      divider: false,
      text: 'test',
      groupName: 'test',
    },
  ];
  constructor(
    public dialogService: DialogService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public messageService: MessageService
  ) { }

  ref: DynamicDialogRef | undefined;
  ProductListDemo: any;
  showModal: boolean = false;
  templates: any = [
    { name: 'First Follow Up', value: 1 },
    { name: 'Second Follow Up', value: 2 },
  ];
  runBasedOn: any = [
    { name: 'before duedate', value: 1 },
    { name: 'after duedate', value: 2 },
    { name: 'after invoicecreation', value: 3 },
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
  public readonly validatorConfiguration: ValidatorConfiguration = {
    step: (step: Step) => {
      if (!!step.name &&
        (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
          step.properties['mailFrom'] as string
        ) as boolean)) {
        step.properties['isValid'] = true;
        return true
      }
      return false
    },
    root: (definition: Definition) =>
      definition.properties['CadenceName'] == '' 
  };

  public ngOnInit() {
    this.updateDefinitionJSON();

    const hours: any[] = Array.from({ length: 100 }, (_, i) => ({
      label: (i + 1).toString(),
      value: i + 1
    }));
    const days: any[] = Array.from({ length: 24 }, (_, i) => ({
      label: (i + 1).toString(),
      value: i + 1
    }));
    const basedon: PickerValueModel[] = [
      { label: 'Before due date', value: 'Before due date' },
      { label: 'After due date', value: 'After due date' },
      { label: 'After invoice creation', value: 'After invoice creation' },

    ];
    this.data[0].list = hours;
    this.selectedDaysValue = this.data[0].list[0].value;
    this.hours[0].list = days;
    this.selectedHoursValue = this.hours[0].list[0].value;
    this.basedon[0].list = basedon;
    this.selectedBasedOnValue = this.basedon[0].list[0].value;
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
    //this.getInvalidStep();
    let step = this.definition.sequence.find(f => f.id == this.selectedStepId);
    if (step) this.selectedStep = step;

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

    if((event.target as HTMLInputElement).type == 'checkbox')
      {
        properties[name] = (event.target as HTMLInputElement).checked;
        return
      }
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  public updateStepName(
    editor: any,
    name: string,
    event: any,
    context: any,
    isNameChanges: boolean = false
  ) {

    let seqns = editor.definition?.sequence;
    let step = editor?.step;
    if (!seqns?.length || !step) return;

    let seq = seqns.find((f: any) => f.id == step.id);
    if (seq) {
      seq[name] = event.target.value;
      if (isNameChanges)
        context.notifyNameChanged();
      else
        context.notifyPropertiesChanged();
    }
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
      this.getInvalidStep();
    })

  }
  private getInvalidStep() {
   
    this.definition.sequence.forEach(seq => {
      var elements = document.querySelectorAll('.sqd-step-task') as NodeListOf<Element>;;
      var matchedElement: any = null;
      // Loop through each element
      elements.forEach((element: any) => {
        var stepId = element.getAttribute('data-step-id');
        if(stepId === this.selectedStepId){
          matchedElement = element;
          var rectElement = matchedElement.querySelector('rect') as HTMLElement;
          if (rectElement) {
            // Change the style fill to aqua
            console.log('reached')
            if (!seq.properties['isValid']) {
              rectElement.style.fill = 'red';
            } // Use setAttribute to change SVG fill
            else {
              rectElement.style.fill = 'green';
            }
          }

        }
      })
    });
   


   
      // Check if the element has the data-step-id attribute
    //  if (element.hasAttribute('data-step-id')) {
        // Get the value of the data-step-id attribute
     //  
        // Compare the attribute value with the provided ID value
         // if () {
        //   matchedElement = element; // Found the matching element
       
        //   return // Exit the loop early since we found the match
        // }
      
   // });
  }

  changeStepColor(matchedElement: any, isSkippable?: boolean) {
    if (matchedElement) {

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



  toggleCheckbox(event: any) {
    this.toggle = !this.toggle;
    this.reflectChanges();
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

  reflectChanges() {
    this.cdr.detectChanges();

    // Optional: Trigger window resize event
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  dayschange(res: PickerResponseModel) {
    this.selectedDaysValue = this.data[res.gIndex].list[res.iIndex].value;
    this.setEmailTrigger();
  }
  hourschange(res: PickerResponseModel) {
    this.selectedHoursValue = this.hours[res.gIndex].list[res.iIndex].value;
    this.setEmailTrigger()
  }
  basedonchange(res: PickerResponseModel) {
    this.selectedBasedOnValue = this.basedon[res.gIndex].list[res.iIndex].value;
    this.setEmailTrigger()
  }

  setEmailTrigger() {
    let seq = this.definition.sequence.find((f: any) => f.id == this.selectedStepId);
    if(!seq) return;
    seq.properties['Days'] = this.selectedDaysValue;
    seq.properties['Hour'] = this.selectedHoursValue;
    seq.properties['RunBasedOn'] = this.selectedBasedOnValue;
    seq.properties['Minute'] = 0;
    seq.properties['ScheduledTime'] = `${this.selectedDaysValue} Days ${this.selectedHoursValue} Hours ${this.selectedBasedOnValue}`
  }
}
