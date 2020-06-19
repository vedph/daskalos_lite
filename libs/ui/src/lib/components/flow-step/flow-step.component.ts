import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Observable, Subscription, Subject, timer, EMPTY } from 'rxjs';
import { switchMap, scan } from 'rxjs/operators';

import { FlowStep, FlowChoice, FlowUserStep, FlowUserChoice } from '@daskalos/core';
import { DialogService } from '../../services/dialog.service';

/**
 * A single step in a running flow.
 */
@Component({
  selector: 'daskalos-flow-step',
  templateUrl: './flow-step.component.html',
  styleUrls: ['./flow-step.component.css']
})
export class FlowStepComponent implements OnDestroy {
  private _step: FlowStep;

  private readonly _timerIntervals$: Subject<number>;
  private readonly _timerTicks$: Observable<number>;
  private _tickSubcription: Subscription;
  private _secondsToGo: number;

  public timeRunning: boolean;
  public timerMessage: string;

  public stepGroup: FormGroup;
  public choiceArray: FormArray;

  /**
   * The step wrapped by this component.
   */
  @Input() public get step(): FlowStep {
    return this._step;
  }
  public set step(value: FlowStep) {
    this.stopTimer(false);

    this._step = value;
    this.initChoiceControls();

    if (value && value.timeAllotted > 0) {
      this.timeRunning = true;
      this._secondsToGo = value.timeAllotted;
      this.startTimer();
    } else {
      this.timeRunning = false;
    }
  }

  /**
   * True if the flow can go backwards. This is true only when no step
   * in the flow has an allotted time for the answer.
   */
  @Input() public canStepBack: boolean;

  @Output() public stepBack: EventEmitter<number>;
  @Output() public stepForward: EventEmitter<FlowUserStep>;
  @Output() public stop: EventEmitter<number>;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService) {
    // form
    this.choiceArray = _formBuilder.array([]);
    this.stepGroup = _formBuilder.group({
      choices: this.choiceArray
    });

    // events
    this.stepBack = new EventEmitter<number>();
    this.stepForward = new EventEmitter<FlowUserStep>();
    this.stop = new EventEmitter<number>();

    // stream of timer intervals
    this._timerIntervals$ = new Subject<number>();
    // stream of timer ticks
    this._timerTicks$ = this._timerIntervals$.pipe(switchMap(
      interval => interval ?
        timer(0, interval).pipe(scan((a, v, i) => a + 1, 0)) :
        EMPTY
    ));

    // subscribe to each tick
    this._tickSubcription = this._timerTicks$.subscribe(n => {
      // check if we have finished
      const left = this._secondsToGo - n;
      if (left <= 0) {
        this.stopTimer(true);
        this.onTimeExpired();
      }
      // update the display
      const days = this.getDays(left);
      const hours = this.getHours(left);
      const minutes = this.getMinutes(left);
      const seconds = this.getSeconds(left);

      const sb = [];
      if (days > 0) {
        sb.push(`${days}d`);
      }
      if (days > 0 || hours > 0) {
        sb.push(`${hours}h`);
      }
      if (days > 0 || hours > 0 || minutes > 0) {
        sb.push(`${minutes}'`);
      }
      sb.push(`${seconds}"`);
      this.timerMessage = sb.join(' ');
    });
  }

  ngOnDestroy(): void {
    this._timerIntervals$.next(0);
    this._tickSubcription.unsubscribe();
  }

  private removeChoiceControls() {
    while (this.choiceArray.length) {
      this.choiceArray.removeAt(0);
    }
  }

  private addChoiceControl(choice: FlowChoice) {
    const group = this._formBuilder.group({
      checked: this._formBuilder.control(false),
      content: this._formBuilder.control(null)
    });
    this.choiceArray.push(group);
  }

  private initChoiceControls() {
    this.removeChoiceControls();
    if (!this._step || !this._step.choices.length) {
      return;
    }
    for (let i = 0; i < this._step.choices.length; i++) {
      this.addChoiceControl(this._step.choices[i]);
    }

    if (this._step.maxChoices === 1) {
      this.stepGroup.addControl('radioChoice',
        this._formBuilder.control(null));
    } else {
      this.stepGroup.removeControl('radioChoice');
    }
  }

  private startTimer() {
    // (re)start the timer by pushing the desired interval
    console.log('starting timer');
    this._timerIntervals$.next(1000);
  }

  private stopTimer(finished: boolean) {
    // stop the timer by pushing a 0 interval
    console.log('stopping timer');
    this._timerIntervals$.next(0);
  }

  // https://stackoverflow.com/questions/36461089/time-countdown-in-angular-2

  private getDays(t: number) {
    const days = Math.floor(t / 86400);
    return days;
  }

  private getHours(t: number) {
    const days = Math.floor(t / 86400);
    t -= days * 86400;
    const hours = Math.floor(t / 3600) % 24;

    return hours;
  }

  private getMinutes(t: number) {
    const days = Math.floor(t / 86400);
    t -= days * 86400;
    const hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    const minutes = Math.floor(t / 60) % 60;

    return minutes;
  }

  private getSeconds(t: number) {
    const days = Math.floor(t / 86400);
    t -= days * 86400;
    const hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    const minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    const seconds = t % 60;

    return seconds;
  }

  // private countCheckedChoices(): number {
  //   let count = 0;
  //   this.step.choices.forEach(c => {
  //     if (c.checked) {
  //       count++;
  //     }
  //   });
  //   return count;
  // }

  public onStepBack() {
    // this.timeRunning = false;
    this.stopTimer(false);
    this.stepBack.emit(this.step.number);
  }

  public onStop() {
    this._dialogService
      .confirm('ATTENTION', `Stop this flow?`)
      .subscribe(result => {
        if (result) {
          this.stopTimer(false);
          this.stop.emit(this.step.number);
        }
      });
  }

  private setCheckedFromRadio() {
    const choiceIndex = parseInt(
      this.stepGroup.controls['radioChoice'].value, 10);

    for (let i = 0; i < this.choiceArray.length; i++) {
      const group: FormGroup = this.choiceArray.controls[i] as FormGroup;
      group.controls['checked'].setValue(i === choiceIndex);
    }
}

  public onStepForward(force = false) {
    const userChoices: FlowUserChoice[] = [];
    let checkedCount = 0;

    if (this._step.maxChoices === 1 && this._step.choices?.length) {
      this.setCheckedFromRadio();
    }

    for (let i = 0; i < this.choiceArray.length; i++) {
      const group: FormGroup = this.choiceArray.controls[i] as FormGroup;
      const choice = this._step.choices[i];

      userChoices.push({
        stepNumber: this._step.number,
        number: choice.number,
        label: choice.label,
        checked: group.controls['checked'].value,
        isFree: choice.isFree,
        freeContent: group.controls['content'].value,
        score: choice.score,
        targetStepNumber: choice.targetStepNumber
      });
      if (group.controls['checked'].value) {
        checkedCount++;
      }
    }

    // nothing to do if no choice selected, unless we're forcing a forward
    if (!force && !checkedCount && this._step.choices?.length) {
      return;
    }
    this.stopTimer(false);

    // build answer and step forward
    const answer: FlowUserStep = {
      number: this.step.number,
      label: this.step.label,
      prompt: this.step.prompt,
      choices: userChoices
    };
    this.stepForward.emit(answer);

    // reset the step form group
    this.stepGroup.reset();
  }

  public onTimeExpired() {
    // step forward without any answer
    this.onStepForward(true);
  }
}
