const { app, BrowserWindow } = require('electron');
const url = require("url");
const path = require("path");
const CalculationService = require('./services/calculation.service');
const HistoryService = require('./services/history.service');

let mainWindow;

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

  const historyService = new HistoryService();
  const calculationService = new CalculationService(historyService);

  historyService.initialize();
  calculationService.initialize();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
