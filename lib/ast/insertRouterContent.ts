import { Rule, Tree } from '@angular-devkit/schematics';
import { join, strings, Path } from '@angular-devkit/core';
import { AstCommonUtil } from './ast-common-util';
import { SyntaxKind } from 'typescript';
import { Configuration } from '../configuration/configuration';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { getImportBaseUrl } from './url-controller';
import { defaultApplicationRouteConfig } from '../configuration/defaults'
import { TypeManager } from '../package-managers/package-manager.enum'
import { normalize } from 'path';

export function addRouterContent(path: string, name: string, config: Configuration) {
  path = normalize(path);
  const astUtil = new AstCommonUtil(path);
  let content = astUtil.getContent();
  const sourceFile = astUtil.getSourceFile(content);
  const flatSourceNodes = astUtil.getSourceNodes(sourceFile);
   // @ts-ignore 
  const insertContent = generateRouteContent(name, config.type);
  if (config.type ==TypeManager['H5']) {
    const importNodes = astUtil.getSyntaxKindNode(flatSourceNodes, SyntaxKind.ImportDeclaration);
    const importPosition = importNodes[importNodes.length - 1].end;
    content = astUtil.setInfoInPosition(content, importPosition, getImportContent(name, config.defaultSrcRoot));
  } else
  if (config.type == TypeManager['TARO_H5']) {
    const taroPageArraryNodes = astUtil.getSyntaxKindNode(flatSourceNodes, SyntaxKind.ArrayLiteralExpression);
    const taroPageArraryPosition = taroPageArraryNodes[taroPageArraryNodes.length - 1].end - 1;
    content = astUtil.setInfoInPosition(content, taroPageArraryPosition, insertContent);
  } else {
    const arrayNodes = astUtil.getSyntaxKindNode(flatSourceNodes, SyntaxKind.ObjectLiteralExpression);
    const arrposition = arrayNodes[arrayNodes.length - 1].end;
    content = astUtil.setInfoInPosition(content, arrposition, insertContent);
  }
  astUtil.overWriteContent(content); 
}

function getImportContent(name: string, defaultSrcRoot: string|undefined) {
  return `
import ${classify(name)} from "${getImportBaseUrl(name, defaultSrcRoot)}"`;
}

function generateRouteContent(name: string, config: string) {
  if (!defaultApplicationRouteConfig[config])  return
  return defaultApplicationRouteConfig[config](name)
}



export function addRouterConst(path: string, name: string, config: Configuration) {
    path = normalize(path);
    const astUtil = new AstCommonUtil(path);
    let content = astUtil.getContent();
    const sourceFile = astUtil.getSourceFile(content);
    const arrayNodes = astUtil.getSyntaxKindNode(astUtil.getSourceNodes(sourceFile), SyntaxKind.PropertyAssignment);
    const position = arrayNodes[arrayNodes.length - 1].end;
    const insertContent = getInsertRoutersConstContent(name, config.defaultSrcRoot);
    content = astUtil.setInfoInPosition(content, position, insertContent);
    return astUtil.overWriteContent(content);
}

function getInsertRoutersConstContent(name, defaultSrcRoot) {
  return `,
  ${strings.camelize(name)}: () => import("${getImportBaseUrl(name, defaultSrcRoot)}")
  `
}
