import { createSourceFile, ScriptTarget, SourceFile, Node, SyntaxKind } from 'typescript';
import * as fs from 'fs';
import { EMOJIS } from '../ui/emojis';

export class AstCommonUtil {
    constructor(private path: string) { }

    // 根据路径获取当前的路径的内容
    getContent() {
        return fs.readFileSync(this.path).toString();
    }

    // 根据内容获取sourceFile -> content 生成的ast文件
    getSourceFile(content: string) {
        return createSourceFile(
            'filename.ts',
            content,
            ScriptTarget.ES2017
        );
    }

    // 展平现在所有的node节点
    getSourceNodes(sourceFile: SourceFile): Node[] {
        const nodes: Node[] = [sourceFile];
        const result: any = [];
        while (nodes.length > 0) {
            const node = nodes.shift();
            if (node) {
                result.push(node);
                if (node.getChildCount(sourceFile) >= 0) {
                    nodes.unshift(...node.getChildren());
                }
            }
        }
        return result;
    }

    // 根据展平的节点 获取当前对应的SyntaxKind 的node节点
    getSyntaxKindNode(nodes: Node[], kind: SyntaxKind): Node[] {
        return nodes.filter((node) => node.kind == kind);
    }

    // 在对应的位置插入对应的数据并返回
    setInfoInPosition(content: string, position: number, insertContent: string) {
        return content.split('').reduce((content, char, index) => {
            if (index === position) {
                return `${content}${insertContent}${char}`;
            } else {
                return `${content}${char}`;
            }
        }, '');
    }

    // 覆盖当前的路径的数据 返回新的tree
    overWriteContent(content: string) {
        // 写入
        fs.writeFileSync(this.path,content);
        console.log(
            `${EMOJIS.ROCKET} 已经成功添加相关路由 ${EMOJIS.ROCKET}`
        );
        
        
    }
}