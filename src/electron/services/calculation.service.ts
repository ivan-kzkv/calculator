import { Calculation } from '../../app/models/calculation.model';

export class CalculationService {
  constructor() {}

  public calculate(calculation: Calculation): number {
    const { firstOperand, secondOperand, operation } = calculation;

    // Handle division by zero and 0/0 cases
    if (operation === 'divide') {
      if (secondOperand === 0) {
        if (firstOperand === 0) {
          throw new Error('Division of zero by zero is undefined');
        }
        throw new Error('Division by zero is not allowed');
      }
    }

    // Handle invalid operations
    if (isNaN(firstOperand) || isNaN(secondOperand)) {
      throw new Error('Invalid operands: operands must be numbers');
    }

    if (!Number.isFinite(firstOperand) || !Number.isFinite(secondOperand)) {
      throw new Error('Invalid operands: operands must be finite numbers');
    }

    switch (operation) {
      case 'add':
        return firstOperand + secondOperand;
      case 'subtract':
        return firstOperand - secondOperand;
      case 'multiply':
        return firstOperand * secondOperand;
      case 'divide':
        return firstOperand / secondOperand;
      default:
        throw new Error('Invalid operation');
    }
  }
} 