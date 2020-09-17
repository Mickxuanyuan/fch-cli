import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { Configuration } from '../configuration/configuration';
import { RouterFinder } from './router-find';
import { FCHConfigurationLoader } from '../configuration/fch-configuration.loader';
import { AstCommonUtil } from './ast-common-util';
import { normalize } from 'path';

export const getBaseUrl = (baseSrcUrl: string) => {
    baseSrcUrl = normalize(baseSrcUrl)
    //使用/xx/的格式传入避免冲突
    const url = process.cwd();
    const baseUrl = url.substr(0, url.indexOf(baseSrcUrl));
    return baseUrl
};

export const getImportBaseUrl = (name: string, baseSrcUrl = "") => {
    baseSrcUrl = normalize(baseSrcUrl)
    const url = process.cwd();
    const baseUrl = url.substr(0, url.indexOf(baseSrcUrl)+baseSrcUrl.length);
    const info = url.replace(baseUrl, "~/solution/").replace(/\\/g, '/');
    
    return `${info}/${dasherize(name)}-component/${dasherize(name)}.component`
}

export const loadConfiguration = async (): Promise<Required<Configuration>> => {
    // 获取当前fch.json 用来判断这事当前的根路径
    const routerRouterPath = await new RouterFinder(/fch\.json$/).find();
    if(!routerRouterPath) {
        console.log("！！！避免不必要的bug请及时添加fch.json文件 ！！！");
    }
    return new FCHConfigurationLoader(
        routerRouterPath ? new AstCommonUtil(routerRouterPath).getContent() : ""
    ).load(); 
};
