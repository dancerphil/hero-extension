import {getDbInstance} from '../sqlite/dbInstance';
import vscode from 'vscode';

const sqliteDrop = async () => {
    const {db, embeddings, versionedFiles, codeContextItems} = getDbInstance();

    embeddings.drop.run();
    versionedFiles.drop.run();
    codeContextItems.drop.run();

    vscode.window.showInformationMessage(`Drop 完毕`);

    // 这是必须的，下一次可以重新创建表
    db.close();
};

export const sqliteDropAction = {
    command: {
        command: 'hero.sqliteDrop',
        title: 'sqlite drop 表',
    },
    callback: sqliteDrop,
};
