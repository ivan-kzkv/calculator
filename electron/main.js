const { app, BrowserWindow, ipcMain } = require('electron');
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/simple-calculator/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

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

  event.reply('calculation-result', result);
});
