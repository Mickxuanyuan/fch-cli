import { AbstractAction } from "./abstract/abstract.action";
import { Input } from "../commands";
import { MESSAGE } from '../lib/ui/message';
import { generateInput, generateChoose } from '../lib/questions/questions';
import * as inquirer from 'inquirer';
import { Answers, Question, PromptModule } from 'inquirer';
import { CollectionFactory } from '../lib/schematics/collection.factory';
import { AbstractCollection } from '../lib/schematics/abstract.collection';
import { SchematicOption } from '../lib/schematics/schematic.option';
import { execSync } from "child_process";
import {RouterFinder} from "../lib/ast/router-find"
import { addRouterContent, addRouterConst } from '../lib/ast/insertRouterContent';
import { Configuration } from "../lib/configuration/configuration";
import { FCHConfigurationLoader } from '../lib/configuration/fch-configuration.loader';
import { AstCommonUtil } from '../lib/ast/ast-common-util';
import { getBaseUrl, loadConfiguration } from '../lib/ast/url-controller';
import { TypeManager } from '../lib/package-managers/package-manager.enum'

// TODO: 判断是否重名， 判断目录是否正确
export class GenerateAction extends AbstractAction {
    public async handle(inputs: Input[]): Promise<void> {
        console.log(`请务必在当前根目录下添加 fch.json 可查看 https://www.npmjs.com/package/@fch/fch-cli 获取详情`);
        
        // 当用户没有输入任何信息的时候这个是要需要询问
        await askForMissingInformation(inputs);
        // 获取到相应的项目名之后开始生成项目
        await generateApplicationFiles(inputs, []);
        // 在生成完部分文件之后要进行一些附加操作
        await askForNeedAddRouter(inputs);
        await askForNeedAddDto(inputs);
        process.exit(0);
    }
}

export const retrieveCols = () => {
    const defaultCols = 80;
    try {
        const terminalCols = execSync('tput cols', {
            stdio: ['pipe', 'pipe', 'ignore'],
        });
        return parseInt(terminalCols.toString(), 10) || defaultCols;
    } catch {
        return defaultCols;
    }
};

const generateApplicationFiles = async (inputs: Input[], options: Input[]) => {
    // 现在暂时没有别的schematics，后面有需求再开放这个这个选项
    const collection: AbstractCollection = CollectionFactory.create({});
    // 将受到的inputs和options 规整成响应的schematics可以识别的变量的类型这样草可以使用schematics进行文件操作
    const schematicOptions: SchematicOption[] = mapSchematicOptions(
        inputs.concat(options)
    );
    const schematicInfo: any = getApplicationInfoInput(inputs, "schematic");
    // 根据命令不同生成不同的项目
    await collection.execute(schematicInfo.value, schematicOptions);
}

// 将出来后面处理的参数skip-install 其他的Input都放到SchematicOption中然后返回一个SchematicOption的对象数组
// 这样便于后面的变量的格式化
const mapSchematicOptions = (options: Input[]): SchematicOption[] => {
    return options.reduce(
        (schematicOptions: SchematicOption[], option: Input) => {
            schematicOptions.push(new SchematicOption(option.name, option.value));
            return schematicOptions;
        },
        [],
    );
};

const getApplicationInfoInput = (inputs: Input[], inputType: string) =>
    inputs.find(input => input.name === inputType);

const askForNeedAddRouter = async (inputs: Input[]) => {
    const config = await loadConfiguration();
    const schematicInput: any = getApplicationInfoInput(inputs, "schematic");
    const name: any = getApplicationInfoInput(inputs, "name");
    if(config.needRouter.includes(schematicInput?.value)) {
        const prompt: PromptModule = inquirer.createPromptModule();
        const message = MESSAGE.PROJECT_ROUTER_INPUT;
        const questions = [generateChoose('needRouter', message)('fch')];
        // 等待用户输入获取结果
        const answers: Answers = await prompt(questions as ReadonlyArray<Question>);
        if(answers.needRouter) {
            // 生成相关的router信息 启用ast的方式
            let routerRouterPath: string
            if(config.type === TypeManager['TARO_H5']) {
                routerRouterPath = await new RouterFinder(/app\.config\.ts$/).find();
            } else {
                routerRouterPath = await new RouterFinder(/\.routes\.ts$/).find();
            }
         
            if(!routerRouterPath) {
                console.log("没有发现对应的router文件");
            } else {
                // 获取到现在的type类型区分是H5还是web
                addRouterContent(routerRouterPath, name?.value, config);
                if(config.type == TypeManager['WEB']) {
                    // 这个时候需要生成对应目录下面的router 导入 微前端会用到
                    addRouterConst(getBaseUrl(config.defaultSrcRoot)+`${config.defaultSrcRoot}shared/constant/routers.const.ts`, name?.value, config) ;
                }
            }
        }
    }
}

const askForNeedAddDto = async (inputs: Input[]) => {
    const config = await loadConfiguration();
    const schematicInput: any = getApplicationInfoInput(inputs, "schematic");
    const name: any = getApplicationInfoInput(inputs, "name");

    if (config.needDto.includes(schematicInput?.value)) {
        const prompt: PromptModule = inquirer.createPromptModule();
        const message = MESSAGE.PROJECT_DTO_INPUT;
        const questions = [generateChoose('needDto', message)('fch')];
        
        const answers: Answers = await prompt(questions as ReadonlyArray<Question>);
        if (answers.needDto) {
            const collection: AbstractCollection = CollectionFactory.create({});
            const schematicOptions: SchematicOption[] = mapSchematicOptions(
                [
                    { name: 'schematic', value: 'd' },
                    name
                ]
            );
            const targetPath = getBaseUrl(config.defaultSrcRoot) + config.baseUrl.dto;
            
            await collection.execute('d', schematicOptions, targetPath);
        }
    }
}

const askForMissingInformation = async (inputs: Input[]) => {
    // 添加开始构建的提示
    console.log(MESSAGE.GENERATE_INFORMATION_START);
    const nameInput = getApplicationInfoInput(inputs, "name");
    if (!nameInput!.value) {
        // inquirer 交互式命令行工具
        // createPromptModule创建一个自包含的inquirer模块。当你重写或者添加一个prmpt type的时候，如果你不想让它影响其它也依赖inquirer的库，可以调用这个
        const prompt: PromptModule = inquirer.createPromptModule();
        const message = MESSAGE.PROJECT_NAME_INPUT;
        const questions = [generateInput('name', message)('fch')];
        // 等待用户输入获取结果
        const answers: Answers = await prompt(questions as ReadonlyArray<Question>);
        replaceInputMissingInformation(inputs, answers);
    }
}

/**
 * @param {Input[]} inputs 用户第一次输入的信息
 * @param {Answers} answers 用户忘记输入name之后再次输入的答案
 * @returns {Input[]} 最后返回包含项目名的input信息
 */
const replaceInputMissingInformation = (
    inputs: Input[],
    answers: Answers,
): Input[] => {
    return inputs.map(
        input =>
            (input.value =
                input.value !== undefined ? input.value : answers[input.name]),
    );
};