import {getDb} from '../sqlite/db';
import {prepareCodeContextItemsDrop, prepareEmbeddingsDrop, prepareVersionedFilesDrop} from "../sqlite/getPrepared";
import vscode from "vscode";

const sqliteDrop = async() => {
    const db = getDb();

    prepareEmbeddingsDrop(db).run();
    prepareVersionedFilesDrop(db).run();
    prepareCodeContextItemsDrop(db).run();

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
