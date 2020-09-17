import { join, resolve } from "path";
import { existsSync } from "fs";
import { AbstractRunner } from './abstract.runner';

export class SchematicRunner extends AbstractRunner {
    constructor() {
        // 向父级传入当前的执行的执行命令的路径，保证当前的schematics可以正常执行
        super(`"${SchematicRunner.findClosestSchematicsBinary()}"`);
    }
    // 获取当前node_module的搜索路径返回的是个数组
    public static getModulePaths() {
        return module.paths;
    }

    /**
     * @static
     * @returns {string} 获取schematics在当前node_module中的执行路径
     * @memberof SchematicRunner
     */
    public static findClosestSchematicsBinary(): string {
        const subPath = join('.bin', 'schematics');
        for (const path of this.getModulePaths()) {
          const binaryPath = resolve(path, subPath);
          if (existsSync(binaryPath)) {
            return binaryPath;
          }
        }
    
        throw new Error("'schematics' binary path could not be found!");
      }
}