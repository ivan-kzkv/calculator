const { app, BrowserWindow, ipcMain } = require('electron');
const url = require("url");
const path = require("path");

let mainWindow;
let calculationHistory = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      autoplayPolicy: 'no-user-gesture-required',
      disableBlinkFeatures: 'Autofill'
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/simple-calculator/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Отключаем DevTools
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle calculation requests
ipcMain.on('calculate', (event, calculation) => {
  let result;
  switch (calculation.operation) {
    case 'add':
      result = calculation.firstOperand + calculation.secondOperand;
      break;
    case 'subtract':
      result = calculation.firstOperand - calculation.secondOperand;
      break;
    case 'multiply':
      result = calculation.firstOperand * calculation.secondOperand;
      break;
    case 'divide':
      result = calculation.firstOperand / calculation.secondOperand;
      break;
    default:
      result = NaN;
  }

  // Add to history
  const historyItem = {
    id: Date.now().toString(),
    firstOperand: calculation.firstOperand,
    secondOperand: calculation.secondOperand,
    operation: calculation.operation,
    result: result,
    timestamp: new Date()
  };
  calculationHistory.push(historyItem);

  // Send both result and history
  event.reply('calculation-result', {
    result: result,
    history: calculationHistory
  });
});

// Handle history requests
ipcMain.on('get-history', (event) => {
  event.reply('get-history-response', calculationHistory);
});

ipcMain.on('delete-history-item', (event, request) => {
  calculationHistory = calculationHistory.filter(item => item.id !== request.id);
  event.reply('delete-history-response');
});
