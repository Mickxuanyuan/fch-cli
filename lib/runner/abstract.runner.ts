import * as chalk from 'chalk';
import { ChildProcess, spawn, SpawnOptions } from 'child_process';
// import { MESSAGES } from '../ui';
import { MESSAGE } from '../ui/message';

export class AbstractRunner {
  // 现阶段可能传入npm yarn schematics
  constructor(protected binary: string) {}

  // 先看为执行当前的command命令
  public async run(
    command: string,
    collect: boolean = false,
    cwd: string = process.cwd(),
  ): Promise<null | string> {
    const args: string[] = [command];
    const options: SpawnOptions = {
      cwd,
      stdio: collect ? 'pipe' : 'inherit',
      shell: true,
    };
    return new Promise<null | string>((resolve, reject) => {
      const child: ChildProcess = spawn(`${this.binary}`, args, options);
      if (collect) {
        child.stdout!.on('data', data =>
          resolve(data.toString().replace(/\r\n|\n/, '')),
        );
      }
      child.on('close', code => {
        if (code === 0) {
          resolve(null);
        } else {
          console.error(
            chalk.red(
              MESSAGE.RUNNER_EXECUTION_ERROR(`${this.binary} ${command}`),
            ),
          );
          reject();
        }
      });
    });
  }
}
