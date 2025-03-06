import { contextBridge, ipcRenderer } from 'electron';
import { IConfig } from '../model';

contextBridge.exposeInMainWorld('forceQuit', {
  // quit
  quit: () => ipcRenderer.send('scb.forceQuit.quit'),
  // deprecared, load menu html ,
  // use getMenuHTML in renderer process directly
  // getMenuHTML: () => ipcRenderer.invoke('LiteLoader.forceQuit.getMenuHTML'),
  // config
  getConfig: () => ipcRenderer.invoke('scb.forceQuit.getConfig'),
  saveConfig: (config: IConfig) => ipcRenderer.send('scb.forceQuit.saveConfig', config),

  //debug
  countWindow: () => ipcRenderer.invoke('debug.countwinodw'),
});