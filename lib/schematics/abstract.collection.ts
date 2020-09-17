
import { AbstractRunner } from '../runner/abstract.runner';
import { SchematicOption } from './schematic.option';
import { Configuration } from '../configuration/configuration';
import { RouterFinder } from '../ast/router-find';
import { FCHConfigurationLoader } from '../configuration/fch-configuration.loader';
import { AstCommonUtil } from '../ast/ast-common-util';
import { loadConfiguration } from '../ast/url-controller';
/**
 * @export
 * @class AbstractCollection 基础类
 */
export class AbstractCollection {
    /**
     *Creates an instance of AbstractCollection.
     * @param {string} collection 启用的schematics 命令现在用的是@fchjs/schematics
     * @param {AbstractRunner} runner 
     * @memberof AbstractCollection
     */
    constructor(protected collection: string, protected runner: AbstractRunner) {}

    /**
     * @param {string} name 表示要生成的在@fchjs/schematics中的目录的名称在collention.json中会有标记
     * @param {SchematicOption[]} options 最后的生成的这些命令都需要在@fchjs/schematics中可以接受
     * @memberof AbstractCollection
     */
    public async execute(name: string, options: SchematicOption[], cwd?:string, collect?:boolean) {
        let command = await this.buildCommandLine(name, options);
        // 最后的部分就是执行这个command
        await this.runner.run(command, collect, cwd);
    }

    private async buildCommandLine(name: string, options: SchematicOption[]) {
      let collection = this.collection;
      if(!collection) {
        const config = await loadConfiguration();
        collection = config.collection;
      }
      
      return `${collection}:${name}${this.buildOptions(options)}`;
    }

    private buildOptions(options: SchematicOption[]): string {
        return options.reduce((line, option) => {
          return line.concat(` ${option.toCommandString()}`);
        }, '');
      }
}