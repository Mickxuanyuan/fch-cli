import { AbstractCommand } from "./abstract/abstract.command";
import { CommanderStatic } from "commander";
import { Input } from "./model/command.input";

export class BuildCommand extends AbstractCommand {
    public load(program: CommanderStatic): void {
        program
        .command('build [app]')
        .description('Build FCH application')
        .action(async (app: string) => {
            const inputs: Input[] = [];
            inputs.push({name: "app", value: app});
            await this.action.handle(inputs);
        })
    }
}