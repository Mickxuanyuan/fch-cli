import { EMOJIS } from './emojis';
import * as chalk from 'chalk';
export const MESSAGE = {
    PROJECT_INFORMATION_START: `${EMOJIS.ZAP}项目即将生成，可能需要一会时间请耐心等待`,
    GENERATE_INFORMATION_START: `${EMOJIS.ZAP}即将生成，可能需要一会时间请耐心等待`,
    PROJECT_NAME_INPUT: `${EMOJIS.SMIRK} 亲，请问你的项目名是什么呢？`,
    PROJECT_TYPE_CHOOSE: `${EMOJIS.SMIRK} 亲，请问你的创建的项目类型是什么？`,
    PROJECT_ROUTER_INPUT: `${EMOJIS.SMIRK} 亲，是否需要添加router相关信息？`,
    PROJECT_DTO_INPUT: `${EMOJIS.SMIRK} 亲，是否需要在 model/dto 下添加对应dto文件？`,
    GENERATE_NAME_INPUT: `${EMOJIS.SMIRK} 亲，请问你想要生成的名称是啥？`,
    RUNNER_EXECUTION_ERROR: (command: string) =>
    `\nFailed to execute command: ${command}`,
    DRY_RUN_MODE: 'Command has been executed in the dry mode, nothing changed!',
    PACKAGE_MANAGER_QUESTION: `${EMOJIS.COFFEE}想用哪个工具来安装依赖包呢？`,
    PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `安装中。。。。 ${EMOJIS.COFFEE}`,
    PACKAGE_MANAGER_INSTALLATION_SUCCEED: (name?: string) =>
    name
      ? `${EMOJIS.ROCKET}  成功创建项目 ${chalk.green(name)}`
      : `${EMOJIS.ROCKET}  成功创建项目`,
    GET_STARTED_INFORMATION: `${EMOJIS.POINT_RIGHT}  使用下面的指令开始你的体验:`,
    CHANGE_DIR_COMMAND: (name: string) => `$ cd ${name}`,
    START_COMMAND: (name: string) => `$ ${name} run start`,
    PACKAGE_MANAGER_INSTALLATION_FAILED: `${EMOJIS.SCREAM}  下载安装包失败`,
    GIT_INITIALIZATION_ERROR: 'git 仓库已经被创建了',
}