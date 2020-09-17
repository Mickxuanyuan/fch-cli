import { existsSync } from 'fs';
import { join } from 'path';
import * as ts from 'typescript';
import { CLI_ERRORS } from '../../ui/errors';

export class TsConfigProvider {
  // 获取当前tsConfig的文件options
  public getByConfigFilename(configFilename: string) {
    const configPath = join(process.cwd(), configFilename);
    if (!existsSync(configPath)) {
      throw new Error(CLI_ERRORS.MISSING_TYPESCRIPT(configFilename));
    }
    const parsedCmd = ts.getParsedCommandLineOfConfigFile(
      configPath,
      undefined!,
      (ts.sys as unknown) as ts.ParseConfigFileHost,
    );
    const { options } = parsedCmd!;
    return { options };
  }
}
