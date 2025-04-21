import { app, BrowserWindow } from 'electron';
import * as path from 'path'
import * as url from 'url'
import { CalculationService } from './services/calculation.service';
import { HistoryService } from './services/history.service';
import { BridgeService } from './services/bridge.service';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../../dist-electron/electron/preload.js'),
      autoplayPolicy: 'no-user-gesture-required',
      disableBlinkFeatures: 'Autofill'
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../../dist-app/simple-calculator/browser/index.html'),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  const historyService = new HistoryService();
  const calculationService = new CalculationService();
  const bridgeService = new BridgeService(calculationService, historyService);

  bridgeService.initialize();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
