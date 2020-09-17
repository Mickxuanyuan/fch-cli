
import { PackageManager } from './package-manager.enum';
import { NpmRunner } from '../runner/npm.runner';
import { Runner } from '../runner/runner';
import { RunnerFactory } from '../runner/runner.factory';
import { AbstractPackageManager } from './abstract.package-manager';
import { PackageManagerCommands } from './package-manager-commands';

export class NpmPackageManager extends AbstractPackageManager {
  constructor() {
    super(RunnerFactory.create(Runner.NPM) as NpmRunner);
  }

  public get name() {
    return PackageManager.NPM.toUpperCase();
  }

  get cli(): PackageManagerCommands {
    return {
      install: 'install',
      add: 'install',
      update: 'update',
      remove: 'uninstall',
      saveFlag: '--save',
      saveDevFlag: '--save-dev',
    };
  }
}
