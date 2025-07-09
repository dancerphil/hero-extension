import vscode from 'vscode';
import {getSavedMessage, setSavedMessage} from '../regions/savedMessage';
import {Action} from '../types';

const showSavedMessage = async () => {
    const message = getSavedMessage();
    if (message) {
        vscode.window.showInformationMessage(message);
    }
    else {
        const userInput = await vscode.window.showInputBox({
            placeHolder: '请输入一句问候',
            prompt: '请输入一句问候',
            value: '你好',
            ignoreFocusOut: true, // 保持输入框焦点
            validateInput: (text) => {
                if (text.trim().length === 0) {
                    return '输入不能为空';
                }
                return null; // 验证通过
            },
        });
        setSavedMessage(userInput);
    }
};

export const showSavedMessageAction: Action = {
    command: {
        command: 'hero.showSavedMessage',
        title: '保存问候',
    },
    description: '输入然后输出',
    callback: showSavedMessage,
};
