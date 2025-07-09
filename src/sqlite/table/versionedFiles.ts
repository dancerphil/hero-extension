import {Database as DatabaseType, Statement} from 'better-sqlite3';

interface VersionedFilesInstance {
    drop: Statement;
    count: Statement<unknown[], {count: number}>;
    insert: Statement<[string, string, string]>;
    get: Statement<[string, string], {id: number; content_hash: string}>;
}

const prepareVersionedFiles = (db: DatabaseType): VersionedFilesInstance => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS versioned_files (
            id                   INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_name          TEXT NOT NULL,
            corpus_relative_path TEXT NOT NULL,
            content_hash         TEXT NOT NULL
        )
    `).run();
    return {
        drop: db.prepare('DROP TABLE versioned_files;'),
        count: db.prepare('SELECT COUNT(*) as count FROM versioned_files'),
        insert: db.prepare(`
            INSERT INTO versioned_files (corpus_name, corpus_relative_path, content_hash)
            VALUES (?, ?, ?)
        `),
        get: db.prepare(`
            SELECT id, content_hash
            FROM versioned_files
            WHERE corpus_name = ? AND corpus_relative_path = ?
        `),
    };
};

export const getVersionedFilesInstance = (db: DatabaseType): VersionedFilesInstance => {
    let versionedFiles: VersionedFilesInstance = null;
    try {
        versionedFiles = prepareVersionedFiles(db);
    }
    catch (error) {
        console.error('创建 versioned_files 失败', error);
        try {
            db.prepare('DROP TABLE versioned_files;').run();
            versionedFiles = prepareVersionedFiles(db);
        }
        catch (error) {
            console.error('重试创建 versioned_files 失败', error);
        }
    }

    return versionedFiles;
};
