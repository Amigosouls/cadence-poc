import { Component, OnInit } from '@angular/core';
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
    properties: { mailFrom: '', scheduledTime: '', emailTemplate:'',  },
  };
}

function createCall(): Step {
	return {
	  id: Uid.next(),
	  componentType: 'task',
	  name: 'Call',
	  type: 'job',
	  properties: { toMail: '', scheduled: '' },
	};
  }

function createDefinition(): Definition {
  return {
    properties: {
      mailFrom: '',
      scheduledTime: '',
      emailTemplate:'',
      testData: 0,
    },
    sequence: [createJob(), createMail(), createCall()],
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
  public visible:boolean = false;
  templates:any=[{name:'First Follow Up', value:0},{name:'Second Follow Up', value:0}]
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
    iconUrlProvider: () => './assets/angular-icon.svg',
  };
  public readonly validatorConfiguration: ValidatorConfiguration = {
    step: (step: Step) =>
      !!step.name && Number(step.properties['testData']) >= 0,
    root: (definition: Definition) =>
      Number(definition.properties['testData']) >= 0,
  };

  public ngOnInit() {
    this.updateDefinitionJSON();
  }

  public onDesignerReady(designer: Designer) {
    this.designer = designer;
    this.updateIsValid();
    console.log('designer ready', this.designer);
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
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
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
}
