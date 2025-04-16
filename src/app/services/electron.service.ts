import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.enum';
import { Calculation } from '../models/calculation.model';

declare global {
  interface Window {
    electron?: {
      send: (channel: string, data: any) => void;
      once: (channel: string, callback: Function) => void;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private isElectron: boolean;

  constructor() {
    this.isElectron = window.electron !== undefined;
  }

  calculate(calculation: Calculation): Observable<number> {
    return new Observable<number>(observer => {
      if (!this.isElectron) {
        let result: number;
        switch (calculation.operation) {
          case Operation.ADD:
            result = calculation.firstOperand + calculation.secondOperand;
            break;
          case Operation.SUBTRACT:
            result = calculation.firstOperand - calculation.secondOperand;
            break;
          case Operation.MULTIPLY:
            result = calculation.firstOperand * calculation.secondOperand;
            break;
          case Operation.DIVIDE:
            result = calculation.firstOperand / calculation.secondOperand;
            break;
          default:
            result = NaN;
        }
        observer.next(result);
        observer.complete();
        return;
      }

      window.electron!.once('calculation-result', (result: number) => {
        observer.next(result);
        observer.complete();
      });

      window.electron!.send('calculate', calculation);
    });
  }
}
