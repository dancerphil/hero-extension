import vscode from "vscode";
import {globby} from 'globby';
import {getDbInstance} from '../sqlite/dbInstance';
import {getCwd} from "../utils/getCwd";
import {apiGetCCI} from "../utils/mock";
import {processFileInsert} from "../sqlite/dbAction";

const sqliteInsert = async() => {
    const {embeddings} = getDbInstance();
    const cwd = getCwd();

    const files = await globby('src/api/*.ts', {
        gitignore: true,
        cwd,
    });

    const result = await apiGetCCI({ files });

    processFileInsert(result);

    const countResult = embeddings.count.get();
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
