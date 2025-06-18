import * as vscode from 'vscode';
import {registerTreeView} from './TreeView';
import {globby} from 'globby';
import {maxBy} from 'lodash';
import {setContext} from "./regions/context";
import {addAction} from "./TreeView/TreeItem";
import {helloWorldAction} from "./actions/helloWorld";
import {openSettingsAction} from "./actions/openSettings";
import {showSavedMessageAction} from "./actions/showSavedMessage";
import {getFilesAction} from "./actions/getFiles";

export function activate(context: vscode.ExtensionContext) {
    console.log('hero-extension 启动完毕');
    setContext(context);
    addAction(helloWorldAction);
    addAction(openSettingsAction);
    addAction(showSavedMessageAction);
    addAction(getFilesAction);
    registerTreeView();
}

export function deactivate() {}
