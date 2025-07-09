import * as vscode from 'vscode';
import {registerTreeView} from './TreeView';
import {setContext} from './regions/context';
import {addAction} from './TreeView/TreeItem';
import {metaAction} from './actions/meta';
import {openSettingsAction} from './actions/openSettings';
import {showSavedMessageAction} from './actions/showSavedMessage';
import {getFilesAction} from './actions/indexingFiles';
import {embeddingAction} from './actions/embedding';
import {sqliteDropAction} from './actions/sqliteDrop';
import {sqliteInsertAction} from './actions/sqliteInsert';
import {sqliteQueryAction} from './actions/sqliteQuery';

export function activate(context: vscode.ExtensionContext) {
    console.log('hero-extension 启动完毕');
    setContext(context);
    addAction(metaAction);
    addAction(openSettingsAction);
    addAction(showSavedMessageAction);
    addAction(getFilesAction);
    addAction(embeddingAction);
    addAction(sqliteDropAction);
    addAction(sqliteInsertAction);
    addAction(sqliteQueryAction);
    registerTreeView();
}

export function deactivate() {
    // 暂时没有需要清理的资源
}
