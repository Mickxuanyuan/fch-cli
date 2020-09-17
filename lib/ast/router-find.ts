import { Path } from '@angular-devkit/core';
import { FileSystemReader } from '../readers';
import { join } from 'path';

export interface FindOptions {
  name?: string;
  path: Path;
  kind?: string;
}

export class RouterFinder {
  constructor(private rgb: RegExp, private endPath: string = "/") {}
  
  public async find(path?: string) {
    if(!path) {
        path = process.cwd();
    }
    const generatedDirectory = await new FileSystemReader(path).list();
    
    return this.findIn(generatedDirectory, path);
  }

  private findIn(directory: Array<string>, path: string): string {
    if (!directory || confirmEnding(path, this.endPath) || path == "/") {
      return "";
    }
    
    const routerFilename= directory.find((filename: string) => {
      return this.rgb.test(filename)
    })
    return routerFilename !== undefined
      ? join(path, "/", routerFilename)
      : this.find(join(path, "..")) as any;
  }
}

function confirmEnding(str, target) {
    var start = str.length-target.length;
    var arr = str.substr(start,target.length);
    if(arr == target) {
        return true;
    }
    return false;
}

