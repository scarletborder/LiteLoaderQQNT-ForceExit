import { IConfig } from '../model';
import { debounce } from './utils';

const forceAPI = window.forceQuit;


const timer = setInterval(() => {
  const MoreMenuManager = window.MoreMenuManager;
  if (MoreMenuManager && MoreMenuManager != undefined) {
    MoreMenuManager.AddItem(exitSvgIcon, 'Exit QQ', () => {
      forceAPI.quit();
    }, 'scb_forceQuit');

    MoreMenuManager.Done();
    clearInterval(timer);
  }

}, 500);

export const onSettingWindowCreated = async (view: HTMLElement) => {
  setTimeout(async () => {
    // 读取配置
    const cfg: IConfig = await forceAPI.getConfig();

    // 添加settings 页面
    const parser = new DOMParser();
    const settingHTML = parser.parseFromString(pluginHtml(cfg), 'text/html').querySelector('plugin-menu');
    if (!settingHTML) {
      console.log('Setting HTML not found');
      return;
    }
    view.appendChild(settingHTML);
    console.log('Setting HTML added');
    const settingsTimer = setInterval(() => {
      // 监听相关选项,只有当用户首次点击选项卡的时候,才会有相关元素出现
      const switchForceQuit = document.getElementById('settings.isForceQuit');
      if (!switchForceQuit) {
        return;
      }
      clearInterval(settingsTimer);

      console.log(switchForceQuit);
      if (switchForceQuit) {
        console.log('start listen');
        switchForceQuit.addEventListener('click', (e) => {
          console.log(e);
          // 原先的属性
          const isActive = (e.target as HTMLInputElement).getAttribute('is-active');
          // 设置新的属性
          (e.target as HTMLInputElement).toggleAttribute('is-active', isActive === null);
          // 保存配置消抖
          const deboucedSaveConfig = debounce((oldIsForceQuit: boolean) => {
            cfg.forceQuit = !oldIsForceQuit;
            forceAPI.saveConfig(cfg);
          }, 300);

          deboucedSaveConfig(!(isActive === null));
        });
      }
    }, 200);
  }, 500);
};

const exitSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
  <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>`;

const pluginHtml = (cfg: IConfig) => `<meta charset="UTF-8">
<plugin-menu>
    <setting-section data-title="关闭选项">

        <setting-panel>
            <setting-list data-direction="column">
                <setting-item data-direction="row">
                    <setting-text>启用后,关闭主窗口将直接关闭QQ进程</setting-text>
                    <setting-switch ${cfg.forceQuit ? 'is-active' : ''} id="settings.isForceQuit"></setting-switch>
                </setting-item>
            </setting-list>

        </setting-panel>
    </setting-section>
</plugin-menu>`;