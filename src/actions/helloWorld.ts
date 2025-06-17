import vscode from "vscode";

export const helloWorldAction = {
    command: {
        command: 'hero.helloWorld',
        title: '显示一则消息',
        description: '这是一个描述',
    },
    callback: () => {
        vscode.window.showInformationMessage('对于不可说的东西我们必须保持沉默。');
    }
}
