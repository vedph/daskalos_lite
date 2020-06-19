import {
  Component,
  OnDestroy,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { Subject, Observable, Subscription, timer, EMPTY } from 'rxjs';
import { switchMap, scan } from 'rxjs/operators';

// example:
// <app-countdown-timer [running]="true" [targetDate]="'+10'" (finished)="onFinished()"></app-countdown-timer>

@Component({
  selector: 'daskalos-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css']
})
export class CountdownTimerComponent implements OnDestroy {
  private readonly _timerIntervals$: Subject<number>;
  private readonly _timerTicks$: Observable<number>;
  private _tickSubcription: Subscription;
  private _targetDate: string;
  private _secondsToGo: number;
  private _running: boolean;

  public days: number;
  public hours: number;
  public minutes: number;
  public seconds: number;
  public message: string;

  /**
   * Target date. It can be expressed as a parsable date
   * in the future, or simply as the number of seconds
   * prefixed by + (e.g. "+15").
   */
  @Input() get targetDate(): string {
    return this._targetDate;
  }
  set targetDate(value: string) {
    this._targetDate = value;
    if (!value) {
      return;
    }
    if (value.startsWith('+')) {
      this._secondsToGo = +value;
    } else {
      this._secondsToGo = Date.parse(value) - Date.parse(new Date().toString());
    }
  }

  /**
   * True to start the timer, false to stop it.
   */
  @Input() get running(): boolean {
    return this._running;
  }
  set running(value: boolean) {
    this._running = value;
    if (value) {
      this.start();
    } else {
      // stopped by parent: don't emit the finished event
      this.stop(false);
    }
  }

  /**
   * Event emitted when the countdown has finished.
   */
  @Output() finished: EventEmitter<string>;

  constructor() {
    this.finished = new EventEmitter<string>();

    // https://stackoverflow.com/questions/42246350/angular-2-restartable-timer
    // stream of timer intervals
    this._timerIntervals$ = new Subject<number>();

    // stream of timer ticks
    // The switchMap operator creates a derived observable (called inner
    // observable) from a source observable and emit those values.
    // When the source emits a new value, it will create a new inner observable,
    // and switch to those values instead.
    // What gets unsubscribed from are the inner observables that get created
    // on the fly, and not the source observable. Here, whenever a new value
    // arrives, representing the interval to be used for the timer, an inner
    // observable gets built from a timer and starts emitting its values,
    // which are then emitted as the subject's values.
    // If the interval is 0, an empty observable is used instead, which
    // results in no emitted value, i.e. the timer is stopped.
    this._timerTicks$ = this._timerIntervals$.pipe(
      switchMap(interval =>
        interval ? timer(0, interval).pipe(scan((a, v) => {
          return a + 1;
        }, 0)) : EMPTY
      )
    );

    // subscribe to each tick
    this._tickSubcription = this._timerTicks$.subscribe(n => {
      // check if we have finished
      const left = this._secondsToGo - n;
      if (left <= 0) {
        this.stop(true);
      }
      // update the display
      this.days = this.getDays(left);
      this.hours = this.getHours(left);
      this.minutes = this.getMinutes(left);
      this.seconds = this.getSeconds(left);

      const sb = [];
      if (this.days > 0) {
        sb.push(`${this.days}d`);
      }
      if (this.days > 0 || this.hours > 0) {
        sb.push(`${this.hours}h`);
      }
      if (this.days > 0 || this.hours > 0 || this.minutes > 0) {
        sb.push(`${this.minutes}'`);
      }
      sb.push(`${this.seconds}"`);
      this.message = sb.join(' ');
    });
  }

  ngOnDestroy(): void {
    this._timerIntervals$.next(0);
    this._tickSubcription.unsubscribe();
  }

  private start() {
    // (re)start the timer by pushing the desired interval
    console.log('starting timer');
    this._timerIntervals$.next(1000);
  }

  private stop(finished: boolean) {
    // stop the timer by pushing a 0 interval
    console.log('stopping timer');
    this._timerIntervals$.next(0);

    // emit finished event if required
    if (finished) {
      this.finished.emit(this._targetDate);
    }
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

  private getMinutes(t) {
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
}
