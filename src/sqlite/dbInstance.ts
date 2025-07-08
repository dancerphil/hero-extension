import * as sqliteVec from "sqlite-vec";
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {ensureDir} from 'fs-extra';
import Database from 'better-sqlite3';
import {Database as DatabaseType} from 'better-sqlite3';
import {getEmbeddingsInstance} from "./table/embeddings";
import {getVersionedFilesInstance} from "./table/versionedFiles";
import {getCodeContextItemsInstance} from "./table/codeContextItems";

interface DbInstance {
    db: DatabaseType;
    embeddings: ReturnType<typeof getEmbeddingsInstance>;
    versionedFiles: ReturnType<typeof getVersionedFilesInstance>;
    codeContextItems: ReturnType<typeof getCodeContextItemsInstance>;
}

let dbInstance: DbInstance | null = null;

export const getDbInstance = () => {
    if (dbInstance?.db && dbInstance?.db.open) {
        return dbInstance;
    }
    ensureDir(resolve(homedir(), '.hero')).catch(() => {
        console.error('Failed to create directory for Hero database.');
    });
    const dbPath = resolve(homedir(), '.hero', 'hero.db');
    const db = new Database(dbPath);
    // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
    db.pragma('journal_mode = WAL');

    sqliteVec.load(db);

    const embeddings = getEmbeddingsInstance(db);
    const versionedFiles = getVersionedFilesInstance(db);
    const codeContextItems = getCodeContextItemsInstance(db);

    return {
        db,
        embeddings,
        versionedFiles,
        codeContextItems
    };
};
