import { AbstractCollection } from './abstract.collection';
import { Collection, ApplicationSchematic } from './collection';
import { SchematicRunner } from '../runner/schematic.runner';
import { Configuration } from '../configuration/configuration';
import { RouterFinder } from '../ast/router-find';
import { FCHConfigurationLoader } from '../configuration/fch-configuration.loader';
import { AstCommonUtil } from '../ast/ast-common-util';

export class FCHCollection extends AbstractCollection {
   constructor(runner: SchematicRunner, isNew: boolean | undefined, type: string | undefined)  {
       // TODO: 获取当前的schematic配置
       // 根据是否是new 来判断当前应该调用什么方式去获取new 个新的项目出来
       // @ts-ignore
       super(isNew ? ApplicationSchematic[type] : "", runner)
   }
}


