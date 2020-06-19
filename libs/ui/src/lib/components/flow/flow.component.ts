import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlowStep, Flow, FlowUserSummary, FlowUserStep } from '@daskalos/core';

/**
 * Running flow.
 */
@Component({
  selector: 'daskalos-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {
  private _flow: Flow;
  private _prevStepNumber: number;
  private _stepBackAllowed: boolean;
  private _summary: FlowUserSummary;

  public step: FlowStep;
  public canStepBack: boolean;

  @Input() get flow(): Flow {
    return this._flow;
  }
  set flow(value: Flow) {
    this._flow = value;
    if (value) {
      this._stepBackAllowed = value.steps.every(s => s.timeAllotted === 0);
    } else {
      this._stepBackAllowed = false;
    }
    this.updateCanStepBack();
    this.start();
  }

  @Output() stepChanged: EventEmitter<FlowStep>;
  @Output() stepAnswered: EventEmitter<FlowUserStep>;
  @Output() closed: EventEmitter<FlowUserSummary>;

  constructor() {
    this.stepChanged = new EventEmitter<FlowStep>();
    this.stepAnswered = new EventEmitter<FlowUserStep>();
    this.closed = new EventEmitter<FlowUserSummary>();
  }

  ngOnInit() {}

  private updateCanStepBack() {
    this.canStepBack =
      this._stepBackAllowed && this.step && this.step.number > 1;
  }

  /**
   * Start the flow.
   */
  private start() {
    if (!this._flow || this._flow.steps.length === 0) {
      return;
    }
    this._prevStepNumber = 0;
    this.step = this._flow.steps[0];
    this.updateCanStepBack();
    this.stepChanged.emit(this.step);

    this._summary = {
      id: this._flow.id,
      label: this._flow.label,
      minScore: this._flow.minScore,
      steps: []
    };
  }

  public onStepBack(number: number) {
    if (this._prevStepNumber < 1) {
      return;
    }
    this.step = this._flow.steps.find(s => s.number === this._prevStepNumber);
    this.updateCanStepBack();
    this._summary.steps.pop();
    this.stepChanged.emit(this.step);
  }

  public onStepForward(answer: FlowUserStep) {
    this._summary.steps.push(answer);
    this.stepAnswered.emit(answer);

    // close if no more steps / target is 0 or does not exist
    if (this.flow.steps.indexOf(this.step) === this.flow.steps.length - 1) {
      this.closed.emit(this._summary);
    }
    let targetStepNr = 0;

    // if expired, goto the designed step
    if (answer.choices.every(c => !c.checked)) {
      targetStepNr = this.step.expiredTarget;
    } else {
      // if choice was selected, goto its target step
      targetStepNr = answer.choices.find(c => c.checked).targetStepNumber;
    }

    // if the target step is the end of the flow, close it
    // (end=target step less than 1, or not existing in the flow)
    if (
      answer.choices?.length &&
      (!targetStepNr ||
        targetStepNr < 1 ||
        this.flow.steps.every(s => s.number !== targetStepNr))
    ) {
      this.closed.emit(this._summary);
      return;
    }

    // determine the next step
    let nextStep: FlowStep = null;
    if (targetStepNr) {
      nextStep = this._flow.steps.find(s => s.number === targetStepNr);
    }
    if (!nextStep) {
      const i = this._flow.steps.indexOf(this.step);
      nextStep = this._flow.steps[i + 1];
    }

    this.step = nextStep;
    this.updateCanStepBack();
    this.stepChanged.emit(this.step);
  }

  public onStop(number: number) {
    this.closed.emit(this._summary);
  }
}
