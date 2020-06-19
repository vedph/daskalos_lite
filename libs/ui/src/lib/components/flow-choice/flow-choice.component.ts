import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FlowChoice } from '@daskalos/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[daskalos-flow-choice]',
  templateUrl: './flow-choice.component.html',
  styleUrls: ['./flow-choice.component.css']
})
export class FlowChoiceComponent implements OnInit {
  private _choice: FlowChoice;

  @Input() get choice(): FlowChoice {
    return this._choice;
  }
  set choice(value: FlowChoice) {
    this._choice = value;
    this.setupForm();
  }
  @Input() multiple: boolean;
  @Output() checkedChange: EventEmitter<FlowChoice>;

  // form
  public checked: FormControl;
  public content: FormControl;
  public choiceGroup: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.checkedChange = new EventEmitter<FlowChoice>();
  }

  private setupForm() {
    this.checked = this._fb.control(false);
    this.content = this._fb.control(null);
    this.choiceGroup = this._fb.group({
      checked: this.checked,
      content: this.content
    });
    this.checked.valueChanges.subscribe(() => {
      // we must notify our container step, which handles
      // checking/unchecking other choices as appropriate
      this._choice.checked = this.checked.value;
      this.checkedChange.emit(this._choice);
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }
}
