import { AbstractAction } from "./abstract/abstract.action";
import { Input } from "../commands";
import { MESSAGE } from '../lib/ui/message';
import { generateInput, generateSelect } from '../lib/questions/questions';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';
import { Answers, Question, PromptModule } from 'inquirer';
import { CollectionFactory } from '../lib/schematics/collection.factory';
import { AbstractCollection } from '../lib/schematics/abstract.collection';
import { SchematicOption } from '../lib/schematics/schematic.option';
import { dasherize } from "@angular-devkit/core/src/utils/strings";
import { PackageManager, TypeManager } from "../lib/package-managers/package-manager.enum";
import { PackageManagerFactory } from '../lib/package-managers/package-manager.factory';
import { AbstractPackageManager } from "../lib/package-managers/abstract.package-manager";
import { execSync } from "child_process";
import { EMOJIS } from '../lib/ui/emojis';
import { ApplicationName } from '../lib/package-managers/package-manager.enum'
import { loadConfiguration } from '../lib/ast/url-controller';

export class NewAction extends AbstractAction {
    public async handle(inputs: Input[], options: Input[]): Promise<void> {
        // 获取dry-run判断是否要模拟生成
        const dryRunOption = options.find(option => option.name === 'dry-run');
        const isDryRunEnabled = dryRunOption && dryRunOption.value;
        // 是安装h5还是web或者其他类型
        const type = await askForProjectType();
        // 当用户没有输入任何信息的时候这个是要需要询问
        await askForMissingInformation(inputs);
        // 获取到相应的项目名之后开始生成项目
        await generateApplicationFiles(inputs, options, type);

        // 判断是否需要安装node_module
        const shouldSkipInstall = options.some(
            option => option.name === 'skip-install' && option.value === true,
        );
        // 生成dash风格的文件夹名称
        const projectDirectory = dasherize(
            getApplicationNameInput(inputs)!.value as string,
        );
        // 如果选择不跳过那么就开始安装依赖包
        if (!shouldSkipInstall) {
            await installPackages(
                options,
                isDryRunEnabled as boolean,
                projectDirectory,
            );
        }
        if (!isDryRunEnabled) {
            // await initializeGitRepository(projectDirectory);
            // await createGitIgnoreFile(projectDirectory);
            // 结语 直接粘贴的
            printCollective();
        }
        process.exit(0);
    }
}

const printCollective = () => {
    const yellow = print('yellow');

    yellow(`${EMOJIS.PRAY} 尽情使用 FCH ${EMOJIS.PRAY}`);
};

const print = (color: string | null = null) => (str = '') => {
    const terminalCols = retrieveCols();
    const strLength = str.replace(/\u001b\[[0-9]{2}m/g, '').length;
    const leftPaddingLength = Math.floor((terminalCols - strLength) / 2);
    const leftPadding = ' '.repeat(Math.max(leftPaddingLength, 0));
    if (color) {
        str = (chalk as any)[color](str);
    }
    console.log(leftPadding, str);
};

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

// 安装依赖包，其中包含
const installPackages = async (
    options: Input[],
    dryRunMode: boolean,
    installDirectory: string,
) => {
    let packageManager: AbstractPackageManager;
    if (dryRunMode) {
        console.info();
        console.info(chalk.green(MESSAGE.DRY_RUN_MODE));
        console.info();
        return;
    }
    packageManager = await selectPackageManager();
    await packageManager.install(
        installDirectory,
        packageManager.name.toLowerCase(),
    );
};


const selectPackageManager = async (): Promise<AbstractPackageManager> => {
    const answers: Answers = await askForPackageManager();
    return PackageManagerFactory.create(answers['package-manager']);
};

// 看用啥来运行安装依赖包是npm还是yarn
const askForPackageManager = async (): Promise<Answers> => {
    const questions: Question[] = [
        generateSelect('package-manager')(MESSAGE.PACKAGE_MANAGER_QUESTION)([
            PackageManager.NPM,
            PackageManager.YARN,
        ]),
    ];
    const prompt = inquirer.createPromptModule();
    return await prompt(questions);
};

const generateApplicationFiles = async (inputs: Input[], options: Input[], type: string) => {
    // 现在暂时没有别的schematics，后面有需求再开放这个这个选项
    const collection: AbstractCollection = CollectionFactory.create({ isNew: true, type});
    // 将受到的inputs和options 规整成响应的schematics可以识别的变量的类型这样草可以使用schematics进行文件操作
    const schematicOptions: SchematicOption[] = mapSchematicOptions(
        inputs.concat(options)
    );

    await collection.execute(ApplicationName[type], schematicOptions);
}

// 将出来后面处理的参数skip-install 其他的Input都放到SchematicOption中然后返回一个SchematicOption的对象数组
// 这样便于后面的变量的格式化
const mapSchematicOptions = (options: Input[]): SchematicOption[] => {
    return options.reduce(
        (schematicOptions: SchematicOption[], option: Input) => {
            if (
                option.name !== 'skip-install'
            ) {
                schematicOptions.push(new SchematicOption(option.name, option.value));
            }
            return schematicOptions;
        },
        [],
    );
};

const getApplicationNameInput = (inputs: Input[]) =>
    inputs.find(input => input.name === 'name');

const askForMissingInformation = async (inputs: Input[]) => {
    // 添加开始构建的提示
    console.log(MESSAGE.PROJECT_INFORMATION_START);

    const nameInput = getApplicationNameInput(inputs);
    
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

const askForProjectType = async () => {
    // 添加开始构建的提示
    // inquirer 交互式命令行工具
    // createPromptModule创建一个自包含的inquirer模块。当你重写或者添加一个prmpt type的时候，如果你不想让它影响其它也依赖inquirer的库，可以调用这个
    const prompt: PromptModule = inquirer.createPromptModule();
    const message = MESSAGE.PROJECT_TYPE_CHOOSE;
    
    const questions = [generateSelect('typeManage')(message)([
        TypeManager.WEB,
        TypeManager.H5,
        TypeManager.TARO_H5
    ]),];
    // 等待用户输入获取结果
    const answers: Answers = await prompt(questions as ReadonlyArray<Question>);
    return answers.typeManage;
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