import vscode from "vscode";

export const getCwd = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders
    const cwd = workspaceFolders ? workspaceFolders[0].uri.fsPath : undefined;
    if (!cwd) {
        vscode.window.showErrorMessage('没有找到工作区文件夹');
        return undefined;
    }
    return cwd;
}
