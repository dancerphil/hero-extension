import * as sqliteVec from "sqlite-vec";
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {ensureDir} from 'fs-extra';
import Database from 'better-sqlite3';
import {Database as DatabaseType} from 'better-sqlite3';
import {
    prepareCodeContextItemsCreate,
    prepareEmbeddingsCreate,
    prepareVersionedFilesCreate
} from "./getPrepared";

// const addColumnToTable = (db: DatabaseType, tableName: string, columnName: string, columnType: string) => {
//     const columnExists = db.prepare(`PRAGMA table_info(${tableName})`).all().some((col: any) => col.name === columnName);
//     if (!columnExists) {
//         db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`).run();
//     }
// };

let db: DatabaseType | null = null;

export const getDb = () => {
    if (db && db.open) {
        return db;
    }
    ensureDir(resolve(homedir(), '.hero')).catch(() => {
        console.error('Failed to create directory for Hero database.');
    });
    const dbPath = resolve(homedir(), '.hero', 'hero.db');
    db = new Database(dbPath);
    // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
    db.pragma('journal_mode = WAL');

    sqliteVec.load(db);

    prepareEmbeddingsCreate(db).run();
    prepareVersionedFilesCreate(db).run();
    prepareCodeContextItemsCreate(db).run();
    // prepared.snippets.create.run();

    // 迁移数据库 20250630
    // addColumnToTable(db, 'embeddings', 'embedding_type', 'TEXT DEFAULT "default"');
    return db;
};
