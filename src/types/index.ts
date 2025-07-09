import vscode from 'vscode';

export interface Action {
    command: vscode.Command;
    description?: string;
    callback: () => void;
}
