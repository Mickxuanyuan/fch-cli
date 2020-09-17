import { dasherize } from '@angular-devkit/core/src/utils/strings';
import * as chalk from 'chalk';
import { readFile } from 'fs';
import * as ora from 'ora';
import { join } from 'path';
import { AbstractRunner } from '../runner/abstract.runner';
import { PackageManagerCommands } from './package-manager-commands';
import { MESSAGE } from '../ui/message';

export abstract class AbstractPackageManager {
  constructor(protected runner: AbstractRunner) {}

  // 安装
  public async install(directory: string, packageManager: string) {
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
      },
      text: MESSAGE.PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS,
    });
    spinner.start();
    try {
      const commandArguments = `${this.cli.install} --silent`;
      const collect = true;
      const dasherizedDirectory: string = dasherize(directory);
      await this.runner.run(
        commandArguments,
        collect,
        join(process.cwd(), dasherizedDirectory),
      );
      spinner.succeed();
      console.info();
      console.info(MESSAGE.PACKAGE_MANAGER_INSTALLATION_SUCCEED(directory));
      console.info(MESSAGE.GET_STARTED_INFORMATION);
      console.info();
      console.info(chalk.gray(MESSAGE.CHANGE_DIR_COMMAND(directory)));
      console.info(chalk.gray(MESSAGE.START_COMMAND(packageManager)));
      console.info();
    } catch {
      spinner.fail();
      console.error(chalk.red(MESSAGE.PACKAGE_MANAGER_INSTALLATION_FAILED));
    }
  }

  public abstract get cli(): PackageManagerCommands;
  public abstract get name(): string;
}
