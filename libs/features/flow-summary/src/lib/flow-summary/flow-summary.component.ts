import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService, FlowUserSummary } from '@daskalos/core';

@Component({
  selector: 'daskalos-flow-summary',
  templateUrl: './flow-summary.component.html',
  styleUrls: ['./flow-summary.component.css']
})
export class FlowSummaryComponent implements OnInit {
  private readonly _id: string;

  public summary: FlowUserSummary;

  constructor(
    route: ActivatedRoute,
    private _localStorageService: LocalStorageService
  ) {
    this._id = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.summary = this._localStorageService.retrieve<FlowUserSummary>(
      'daskalos.result.' + this._id
    );
  }
}
