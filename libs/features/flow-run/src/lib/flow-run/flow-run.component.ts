import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Flow, FlowUserSummary, LocalStorageService } from '@daskalos/core';
import { LocalFlowsService } from '@daskalos/api';

@Component({
  selector: 'daskalos-flow-run',
  templateUrl: './flow-run.component.html',
  styleUrls: ['./flow-run.component.css']
})
export class FlowRunComponent implements OnInit {
  private readonly _id: string;

  public flow$: Observable<Flow>;

  constructor(
    route: ActivatedRoute,
    private _router: Router,
    private _flowService: LocalFlowsService,
    private _localStorageService: LocalStorageService
  ) {
    this._id = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.flow$ = this._flowService.getFlow(this._id);
  }

  public flowClosed(flow: FlowUserSummary) {
    this._localStorageService.store('daskalos.result.' + this._id, flow);
    this._router.navigate(['results', this._id]);
  }
}
