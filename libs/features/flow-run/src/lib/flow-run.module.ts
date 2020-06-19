import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlowRunComponent } from './flow-run/flow-run.component';
import { ApiModule } from '@daskalos/api';
import { MaterialModule } from '@daskalos/material';
import { UiModule } from '@daskalos/ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: FlowRunComponent }
    ]),
    ApiModule,
    MaterialModule,
    UiModule
  ],
  declarations: [FlowRunComponent],
  exports: [FlowRunComponent]
})
export class FlowRunModule {}
