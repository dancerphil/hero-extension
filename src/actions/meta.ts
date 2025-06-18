import vscode from "vscode";
import {Action} from "../types";

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
        return JSON.stringify(process.versions, null, 4);
    }
}

export const metaAction: Action = {
    command: {
        command: 'hero.meta',
        title: '显示元信息',
    },
    description: 'node 版本',
    callback: async () => {
        vscode.window.showInformationMessage(`node version: ${process.version}`);
        vscode.workspace.registerTextDocumentContentProvider('hero.text', new TextDocumentContentProvider());
        let uri = vscode.Uri.parse(`hero.text:meta`);
        let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        await vscode.window.showTextDocument(doc, { preview: false });
    }
}
