import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoreModule } from '@daskalos/core';
import { MaterialModule } from '@daskalos/material';
import { UiModule } from '@daskalos/ui';

import { FlowSummaryComponent } from './flow-summary/flow-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: FlowSummaryComponent }
    ]),
    CoreModule,
    MaterialModule,
    UiModule
  ],
  declarations: [FlowSummaryComponent],
  exports: [FlowSummaryComponent]
})
export class FlowSummaryModule {}
