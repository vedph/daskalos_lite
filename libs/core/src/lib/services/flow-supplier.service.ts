import { Injectable } from '@angular/core';
import { Flow } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FlowSupplierService {
  public supply(flow: Flow) {
    // steps
    if (!flow.steps) {
      flow.steps = [];
      return;
    }

    for (let i = 0; i < flow.steps.length; i++) {
      const step = flow.steps[i];
      // number
      if (!step.number) {
        step.number = i + 1;
      }
      // maxChoices
      if (!step.maxChoices) {
        step.maxChoices = 1;
      }

      // choices
      if (!step.choices) {
        step.choices = [];
      }
      for (let j = 0; j < step.choices.length; j++) {
        const choice = step.choices[j];
        // number
        if (!choice.number) {
          choice.number = j + 1;
        }
      }
    }
  }
}
