import { AbstractCommand } from "./abstract/abstract.command";
import { CommanderStatic, Command } from "commander";
import { Input } from './model/command.input';

export class GenerateCommand extends AbstractCommand {
    /**
     * @param {CommanderStatic} program
     * @memberof GenerateCommand
     * dry-run: schematics 提供的功能，当为true只能看到生成的目录结构和文件，不会真的生成文件
     */
    public load(program: CommanderStatic): void {
        program
        .command('generate <schematic> [name] [path]')
        .alias('g')
        .description('生成想用的文件\n c: 生成hooks组件\n rc: 生成带有reducer的组件\n s: 生成请求的service文件 \n d: 生成相应dto文件')
        .action(async ( schematic: string,
            name: string,
            path: string) => {
            const inputs: Input[] = [];
            inputs.push({ name: 'schematic', value: schematic });
            inputs.push({ name: 'name', value: name });
            inputs.push({ name: 'path', value: path });
            await this.action.handle(inputs);
        })
    }
}