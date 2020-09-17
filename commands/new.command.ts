import { AbstractCommand } from "./abstract/abstract.command";
import { CommanderStatic, Command } from "commander";
import { Input } from './model/command.input';

export class NewCommand extends AbstractCommand {
    /**
     * @param {CommanderStatic} program
     * @memberof NewCommand
     * dry-run: schematics 提供的功能，当为true只能看到生成的目录结构和文件，不会真的生成文件
     */
    public load(program: CommanderStatic): void {
        program
        .command('new [name]')
        .alias('n')
        .description('生成新的应用\n options: \n -d 只能看到生成的目录结构和文件，不会真的生成文件\n -s 跳过安装node_module')
        .option('-d, --dry-run', '只能看到生成的目录结构和文件，不会真的生成文件')
        .option('-s, --skip-install', '跳过安装node_module')
        .option('-l, --language [language]', '安装的语言现在只支持ts')
        .action(async (name: string, command: Command) => {
            const options: Input[] = [];
            options.push({ name: 'dry-run', value: !!command.dryRun });
            options.push({ name: 'skip-install', value: !!command.skipInstall });
            options.push({ name: 'language', value: !!command.language ? command.language : 'ts' });

            const inputs: Input[] = [];
            inputs.push({name: "name", value: name});

            await this.action.handle(inputs, options);
        })
    }
}