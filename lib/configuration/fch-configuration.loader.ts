import { Reader } from '../readers';
import { Configuration } from './configuration';
import { ConfigurationLoader } from './configuration.loader';
import { defaultConfiguration } from './defaults';
// 用来合并属性
export class FCHConfigurationLoader implements ConfigurationLoader {
  constructor(private content: string) {}

  public async load(): Promise<Required<Configuration>> {
    // 读取默认的.json配置文件
    
    if (!this.content) {
      return defaultConfiguration;
    }
    const fileConfig = JSON.parse(this.content);
    return {
      ...defaultConfiguration,
      ...fileConfig,
    };
  }
}
