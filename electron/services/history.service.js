const { ipcMain } = require('electron');

class HistoryService {
  constructor() {
    this.history = [];
  }

  initialize() {
    ipcMain.on('get-history', (event) => {
      event.reply('get-history-response', this.history);
    });

    ipcMain.on('delete-history-item', (event, request) => {
      this.deleteHistoryItem(request.id);
      event.reply('delete-history-response');
    });
  }

  addToHistory(item) {
    this.history.push(item);
  }

  getHistory() {
    return this.history;
  }

  deleteHistoryItem(id) {
    this.history = this.history.filter(item => item.id !== id);
  }
}

module.exports = HistoryService; 