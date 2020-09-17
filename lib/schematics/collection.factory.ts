import { Collection } from './collection';
import { Runner } from '../runner/runner';
import { SchematicRunner } from '../runner/schematic.runner';
import { RunnerFactory } from '../runner/runner.factory';
import { AbstractCollection } from './abstract.collection';
import { FCHCollection } from './fch.collection';
 
interface ICollectionFactory {
  type?: string;
  isNew?: boolean | undefined
}
export class CollectionFactory {
  public static create(collectionOption: ICollectionFactory ): AbstractCollection {
      // 获取相应的schematic的类型 按照规律去执行
      // 这种情况下使用schematics去运行这些命令
      // 将runner的信息带到Collection中去
      return new FCHCollection(
        RunnerFactory.create(Runner.SCHEMATIC) as SchematicRunner,
        collectionOption.isNew,
        collectionOption.type
      );
  }
}
