import { ipcMain } from 'electron';
import { CalculationService } from './calculation.service';
import { HistoryService } from './history.service';
import { Calculation } from '../../app/models/calculation.model';

export class BridgeService {
  private calculationService: CalculationService;
  private historyService: HistoryService;

  constructor(calculationService: CalculationService, historyService: HistoryService) {
    this.calculationService = calculationService;
    this.historyService = historyService;
  }

  initialize(): void {
    // Handle calculation requests
    ipcMain.on('calculate', (event, calculation: Calculation) => {
      try {
        const result = this.calculationService.calculate(calculation);
        const historyItem = this.historyService.createHistoryItem(calculation, result);
        this.historyService.addToHistory(historyItem);
        
        event.reply('calculation-result', {
          result: result,
          history: this.historyService.getHistory()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        event.reply('calculation-result', {
          result: null,
          error: errorMessage,
          history: this.historyService.getHistory()
        });
      }
    });

    // Handle history requests
    ipcMain.on('get-history', (event) => {
      event.reply('get-history-response', this.historyService.getHistory());
    });

    ipcMain.on('delete-history-item', (event, request: { id: string }) => {
      this.historyService.deleteHistoryItem(request.id);
      event.reply('delete-history-response', this.historyService.getHistory());
    });
  }
} 