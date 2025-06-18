import vscode from "vscode";
import {globby} from "globby";
import {maxBy} from "lodash";
import {Action} from "../types";

export const getFilesAction: Action = {
    command: {
        command: 'hero.getFiles',
        title: '获取所有文件',
    },
    description: '目前太慢，跑不过去',
    callback: async () => {
        vscode.window.showInformationMessage('开始扫描');
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders
            const cwd = workspaceFolders ? workspaceFolders[0].uri.fsPath : undefined;
            if (!cwd) {
                vscode.window.showErrorMessage('没有找到工作区文件夹');
                return;
            }
            const results = await globby([
                'packages/cli/**/*',
                'packages/client/**/*',
                'packages/engine/**/*',
                // 'packages/engine-connector/**/*',
                'packages/init/**/*',
                'packages/jsx/**/*',
                // 'packages/kernel/**/*',
                'packages/kernel-shared/**/*',
            ], {
                cwd,
                gitignore: true,
            })

            if (!results) {
                vscode.window.showErrorMessage('没有找到任何文件');
                return;
            }

            vscode.window.showInformationMessage(results.length + ' 个文件');
            vscode.window.showInformationMessage(`最长的文件：${maxBy(results, i => i.length)}`);
        }
        catch (e) {
            vscode.window.showErrorMessage('获取文件失败: ' + (e as Error).message);
        }
    }
}
