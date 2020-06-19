import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Flow,
  ErrorService,
  FlowSupplierService} from '@daskalos/core';
import { retry, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalFlowsService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _flowSupplier: FlowSupplierService
  ) {}

  /**
   * Get the flow with the specified ID.
   *
   * @param id The flow's ID.
   */
  public getFlow(id: string): Observable<Flow> {
    return this._http.get<Flow>('./assets/flows/' + id + '.json').pipe(
      retry(3),
      catchError(this._error.handleError),
      tap(flow => this._flowSupplier.supply(flow))
    );
  }
}
