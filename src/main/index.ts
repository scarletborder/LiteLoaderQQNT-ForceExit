import { ipcMain, BrowserWindow, app } from 'electron';
import { myConfig } from './config';

let windowCount = 0;
let everWindowCount = 0;

ipcMain.on('scb.forceQuit.quit', (event) => {
  console.log(process.pid);
  console.log(process.ppid);
  // try { process.kill(process.pid, 'SIGKILL'); } finally { process.exit(1); }
  app.quit();
});

ipcMain.on('scb.forceQuit.saveConfig', (event, config) => {
  myConfig.saveConfig(config);
});

ipcMain.handle('scb.forceQuit.getConfig', (event) => {
  return Promise.resolve(myConfig.getConfig());
});

ipcMain.handle('debug.countwinodw', () => {
  return Promise.resolve(windowCount);
});



export const onBrowserWindowCreated = (window: BrowserWindow) => {
  windowCount++;
  everWindowCount++;
  // 注册更多菜单
  const MoreMenuRegister = global.MoreMenuRegister;
  MoreMenuRegister.registerPlugin('scb_forceQuit');

  window.on('close', () => {
    windowCount--;
    if (windowCount < 1 && everWindowCount >= 4) { // 幽默qq所有窗口title都叫'QQ'
      if (myConfig.getConfig().forceQuit) {
        app.quit();
      }
    }
  });
  return;
};