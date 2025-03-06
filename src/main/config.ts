import path from 'path';
import fs from 'fs';
import { IConfig } from '../model';

const pluginName = 'lite_loader_qqnt_force_exit';

class Config {
  private _config: IConfig = {
    forceQuit: false
  };
  public pluginPath: string = '';
  public configPath: string = '';

  constructor() {
    this.pluginPath = path.join(LiteLoader.plugins.lite_loader_qqnt_force_exit.path.plugin);
    this.configPath = path.join(this.pluginPath, 'config.json');
    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, JSON.stringify(this._config, null, 4), 'utf-8');
    } else {
      Object.assign(this._config, JSON.parse(fs.readFileSync(this.configPath, 'utf-8').toString()));
    }
  }

  public getConfig(): IConfig {
    return this._config;
  }

  public async saveConfig(config: IConfig): Promise<void> {
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 4), 'utf-8');
    Object.assign(this._config, config);
  }
}

export const myConfig = new Config();