import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.enum';
import { Calculation } from '../models/calculation.model';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  constructor(private electronService: ElectronService) {}

  calculate(firstOperand: number, secondOperand: number, operation: Operation): Observable<number> {
    const calculation: Calculation = {
      firstOperand,
      secondOperand,
      operation,
      timestamp: new Date()
    };

    return this.electronService.calculate(calculation);
  }
}
