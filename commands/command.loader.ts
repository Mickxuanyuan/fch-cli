import { CommanderStatic } from 'commander';
import { NewCommand } from './new.command';
import { NewAction } from '../actions/new.action';
import { BuildCommand } from './build.command';
import { GenerateCommand } from './generate.command';
import { GenerateAction } from '../actions/generate.action';

export class CommandLoader {
    public static load(program: CommanderStatic) {
        new NewCommand(new NewAction()).load(program);
        new GenerateCommand(new GenerateAction()).load(program);
    }
}