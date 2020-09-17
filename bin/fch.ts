#!/usr/bin/env node
import * as commander from 'commander';
import { CommanderStatic } from 'commander';
import { CommandLoader } from '../commands';
import * as figlet from "figlet";
import Printer from '@darkobits/lolcatjs';
import { EMOJIS } from '../lib/ui/emojis';
const printer = new Printer();
const txt = figlet.textSync('F C H', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default'
});
console.log(`\n     ${EMOJIS.ROCKET}${EMOJIS.ROCKET} 凡车汇脚手架 ${EMOJIS.ROCKET}${EMOJIS.ROCKET}`);
printer.fromString(txt);
console.log(printer.toString());
const bootstrap = () => {
    const program: CommanderStatic = commander;
    program
    .version(require('../package.json').version)
    .usage('<command> [options]');
    CommandLoader.load(program);
    commander.parse(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
}

bootstrap();