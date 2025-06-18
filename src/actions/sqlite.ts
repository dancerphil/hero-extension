import * as sqliteVec from "sqlite-vec";
import Database from 'better-sqlite3';
import vscode from "vscode";

const runSqlite = async() => {
    const db = new Database(":memory:");
    sqliteVec.load(db);

    const { vec_version } = db
        .prepare("select vec_version() as vec_version;")
        .get();

    vscode.window.showInformationMessage(`vec_version: ${vec_version}`);

    const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
    const result = db
        .prepare("select vec_length(?) as result")
        .get(new Uint8Array(embedding.buffer));

    vscode.window.showInformationMessage(`result: ${result.result}`);
}

export const sqliteAction = {
    command: {
        command: 'hero.sqlite',
        title: 'sqlite',
    },
    callback: runSqlite,
}
