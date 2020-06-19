import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@daskalos/core';
import { MaterialModule } from '@daskalos/material';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { FlowStepComponent } from './components/flow-step/flow-step.component';
import { FlowChoiceComponent } from './components/flow-choice/flow-choice.component';
import { FlowComponent } from './components/flow/flow.component';
import { FlowEndComponent } from './components/flow-end/flow-end.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModule,
    MaterialModule
  ],
  declarations: [
    ConfirmDialogComponent,
    CountdownTimerComponent,
    FlowStepComponent,
    FlowChoiceComponent,
    FlowComponent,
    FlowEndComponent,
    SafeHtmlPipe
  ],
  exports: [
    ConfirmDialogComponent,
    CountdownTimerComponent,
    FlowStepComponent,
    FlowChoiceComponent,
    FlowComponent,
    FlowEndComponent,
    SafeHtmlPipe
  ]
})
export class UiModule {}
