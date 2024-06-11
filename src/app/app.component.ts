import { Component } from '@angular/core';
import { Designer, Definition, ToolboxConfiguration, StepsConfiguration, ValidatorConfiguration, Properties, RootEditorContext, Step, StepEditorContext } from 'sequential-workflow-designer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cadence-poc';
  private designer?: Designer;
  public definition: Definition = { /* ... */ };
  public toolboxConfiguration: ToolboxConfiguration = { /* ... */ };
  public stepsConfiguration: StepsConfiguration = { /* ... */ };
  public validatorConfiguration: ValidatorConfiguration = { /* ... */ };

  public onDesignerReady(designer: Designer) {
    this.designer = designer;
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
  }

  public onSelectedStepIdChanged(stepId: string | null) {
    // ...
  }

  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(properties: Properties, name: string, event: Event, context: RootEditorContext | StepEditorContext) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }


}
interface RootEditorWrapper {
  definition: Definition;
  context: RootEditorContext;
  isReadonly: boolean;
}

interface StepEditorWrapper {
  step: Step;
  definition: Definition;
  context: StepEditorContext;
  isReadonly: boolean;
}


