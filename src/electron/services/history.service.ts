import { Calculation } from '../../app/models/calculation.model';

export class HistoryService {
  private history: Calculation[];

  constructor() {
    this.history = [];
  }

  createHistoryItem(calculation: Calculation, result: number): Calculation {
    return {
      id: Date.now().toString(),
      firstOperand: calculation.firstOperand,
      secondOperand: calculation.secondOperand,
      operation: calculation.operation,
      result: result,
      timestamp: new Date()
    };
  }

  addToHistory(item: Calculation): void {
    this.history.push(item);
  }

  getHistory(): Calculation[] {
    return this.history;
  }

  deleteHistoryItem(id: string): void {
    this.history = this.history.filter(item => item.id !== id);
  }
} 