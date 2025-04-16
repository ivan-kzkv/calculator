import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Operation } from '../models/operation.enum';
import { Calculation } from '../models/calculation.model';
import { ElectronService } from './electron.service';
import { HistoryService } from './history.service';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  constructor(
    private electronService: ElectronService,
    private historyService: HistoryService
  ) {}

  calculate(firstOperand: number, secondOperand: number, operation: Operation): Observable<number> {
    const calculation: Calculation = {
      firstOperand,
      secondOperand,
      operation,
      timestamp: new Date()
    };

    return this.electronService.calculate(calculation).pipe(
      tap(response => {
        if (response && response.history) {
          this.historyService.updateHistory(response.history);
        }
      }),
      map(response => response.result)
    );
  }
}
