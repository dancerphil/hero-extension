import * as vscode from 'vscode';
import {registerTreeView} from './TreeView';
import {setContext} from "./regions/context";
import {addAction} from "./TreeView/TreeItem";
import {metaAction} from "./actions/meta";
import {openSettingsAction} from "./actions/openSettings";
import {showSavedMessageAction} from "./actions/showSavedMessage";
import {getFilesAction} from "./actions/getFiles";
import {sqliteAction} from "./actions/sqlite";

export function activate(context: vscode.ExtensionContext) {
    console.log('hero-extension 启动完毕');
    setContext(context);
    addAction(metaAction);
    addAction(openSettingsAction);
    addAction(showSavedMessageAction);
    addAction(getFilesAction);
    addAction(sqliteAction);
    registerTreeView();
}

export function deactivate() {}
