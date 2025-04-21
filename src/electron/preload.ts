import { contextBridge, ipcRenderer } from 'electron';

const SEND_CHANNELS = ['calculate', 'get-history', 'delete-history-item'];
const RECEIVE_CHANNELS = ['calculation-result', 'get-history-response', 'delete-history-response'];

const isValidChannel = (channel: string, validChannels: string[]) => validChannels.includes(channel);

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => {
    if (isValidChannel(channel, SEND_CHANNELS)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel: string, callback: (...args: any[]) => void) => {
    if (isValidChannel(channel, RECEIVE_CHANNELS)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  once: (channel: string, callback: (...args: any[]) => void) => {
    if (isValidChannel(channel, RECEIVE_CHANNELS)) {
      ipcRenderer.once(channel, (event, ...args) => callback(...args));
    }
  }
});
