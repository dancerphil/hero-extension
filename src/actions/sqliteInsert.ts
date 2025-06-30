import vscode from "vscode";
import {globby} from 'globby';
import {getDb} from '../sqlite/db';
import {getCwd} from "../utils/getCwd";
import {apiGetCCI} from "../utils/mock";
import {processFileInsert} from "../sqlite/dbAction";
import {prepareEmbeddingsCount} from "../sqlite/getPrepared";

const sqliteInsert = async() => {
    const db = getDb();
    const cwd = getCwd();

    const files = await globby('src/api/*.ts', {
        gitignore: true,
        cwd,
    });

    const result = await apiGetCCI({ files });

    processFileInsert(result);

    const countResult = prepareEmbeddingsCount(db).get() as { count: number };
    const count = countResult.count;

    vscode.window.showInformationMessage(`Records in table: ${count}`);
};

export const sqliteInsertAction = {
    command: {
        command: 'hero.sqliteInsert',
        title: 'sqlite 插入',
    },
    callback: sqliteInsert,
};
