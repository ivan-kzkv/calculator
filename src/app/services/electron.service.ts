import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.enum';
import { Calculation, CalculationResponse } from '../models/calculation.model';

declare global {
  interface Window {
    electron?: {
      send: (channel: string, data?: any) => void;
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

  calculate(calculation: Calculation): Observable<CalculationResponse> {
    return new Observable<CalculationResponse>(observer => {
      if (!this.isElectron) {
        let result: number | null = null;
        let error: string | undefined;

        try {
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
              if (calculation.secondOperand === 0) {
                if (calculation.firstOperand === 0) {
                  error = 'Division of zero by zero is undefined';
                } else {
                  error = 'Division by zero is not allowed';
                }
              } else {
                result = calculation.firstOperand / calculation.secondOperand;
              }
              break;
            default:
              error = 'Invalid operation';
          }
        } catch (e) {
          error = e instanceof Error ? e.message : 'Unknown error';
        }

        observer.next({ result, error, history: [] });
        observer.complete();
        return;
      }

      window.electron!.once('calculation-result', (response: CalculationResponse) => {
        observer.next(response);
        observer.complete();
      });

      window.electron!.send('calculate', calculation);
    });
  }

  send(channel: string, data?: any): void {
    if (this.isElectron) {
      window.electron!.send(channel, data);
    }
  }

  once(channel: string, callback: Function): void {
    if (this.isElectron) {
      window.electron!.once(channel, callback);
    }
  }
}
