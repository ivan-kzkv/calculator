import { Operation } from './operation.enum';

export interface Calculation {
  id?: string;
  firstOperand: number;
  secondOperand: number;
  operation: Operation;
  timestamp: Date;
  result?: number;
}
