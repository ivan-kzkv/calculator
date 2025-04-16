import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.enum';
import { Calculation } from '../models/calculation.model';

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

  calculate(calculation: Calculation): Observable<{ result: number, history: Calculation[] }> {
    return new Observable<{ result: number, history: Calculation[] }>(observer => {
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
        observer.next({ result, history: [] });
        observer.complete();
        return;
      }

      window.electron!.once('calculation-result', (response: { result: number, history: Calculation[] }) => {
        // Ensure history is always an array
        const safeResponse = {
          result: response.result,
          history: Array.isArray(response.history) ? response.history : []
        };
        observer.next(safeResponse);
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
