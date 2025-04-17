const { contextBridge, ipcRenderer } = require('electron');

const SEND_CHANNELS = ['calculate', 'get-history', 'delete-history-item'];
const RECEIVE_CHANNELS = ['calculation-result', 'get-history-response', 'delete-history-response'];

const isValidChannel = (channel, validChannels) => validChannels.includes(channel);

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    if (isValidChannel(channel, SEND_CHANNELS)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, callback) => {
    if (isValidChannel(channel, RECEIVE_CHANNELS)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  once: (channel, callback) => {
    if (isValidChannel(channel, RECEIVE_CHANNELS)) {
      ipcRenderer.once(channel, (event, ...args) => callback(...args));
    }
  }
});
