const { ipcMain } = require('electron');

class CalculationService {
  constructor(historyService) {
    this.historyService = historyService;
  }

  initialize() {
    ipcMain.on('calculate', (event, calculation) => {
      const result = this.calculate(calculation);
      const historyItem = this.createHistoryItem(calculation, result);
      
      this.historyService.addToHistory(historyItem);
      
      event.reply('calculation-result', {
        result: result,
        history: this.historyService.getHistory()
      });
    });
  }

  calculate(calculation) {
    switch (calculation.operation) {
      case 'add':
        return calculation.firstOperand + calculation.secondOperand;
      case 'subtract':
        return calculation.firstOperand - calculation.secondOperand;
      case 'multiply':
        return calculation.firstOperand * calculation.secondOperand;
      case 'divide':
        return calculation.firstOperand / calculation.secondOperand;
      default:
        return NaN;
    }
  }

  createHistoryItem(calculation, result) {
    return {
      id: Date.now().toString(),
      firstOperand: calculation.firstOperand,
      secondOperand: calculation.secondOperand,
      operation: calculation.operation,
      result: result,
      timestamp: new Date()
    };
  }
}

module.exports = CalculationService; 