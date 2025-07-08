import * as sqliteVec from "sqlite-vec";
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {ensureDir} from 'fs-extra';
import Database from 'better-sqlite3';
import {Database as DatabaseType} from 'better-sqlite3';
import {getEmbeddingsInstance} from "./embeddings";

const prepareVersionedFiles = (db: DatabaseType) => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS versioned_files (
            id                   INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_name          TEXT NOT NULL,
            corpus_relative_path TEXT NOT NULL,
            content_hash         BLOB NOT NULL
        )
    `).run();
    return {
        drop: db.prepare(`DROP TABLE versioned_files;`),
        insert: db.prepare(`
            INSERT INTO versioned_files (corpus_name, corpus_relative_path, content_hash)
            VALUES (?, ?, ?)
        `),
        get: db.prepare(`
            SELECT id, content_hash
            FROM versioned_files
            WHERE corpus_name = ? AND corpus_relative_path = ?
        `)
    };
};

const prepareCodeContextItems = (db: DatabaseType) => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS code_context_items (
            id                     INTEGER PRIMARY KEY AUTOINCREMENT,
            node_uri               TEXT    NOT NULL,
            node_name              TEXT    NOT NULL,
            code_context_type      TEXT    NOT NULL,
            versioned_file_id      INTEGER NOT NULL,
            expected_snippet_count INTEGER NOT NULL
        )
    `).run();
    return {
        insert: db.prepare(`
            INSERT INTO code_context_items (
                node_uri,
                node_name,
                code_context_type,
                versioned_file_id,
                expected_snippet_count
            )
            VALUES (?, ?, ?, ?, ?)
        `),
        // 这里是 LIMIT 5
        select: db.prepare(`
            SELECT node_name
            FROM code_context_items
            WHERE id IN (?, ?, ?, ?, ?)
        `),
        drop: db.prepare(`DROP TABLE code_context_items;`)
    };
};

export const getVersionedFilesInstance = (db: DatabaseType) => {
    let versionedFiles;
    try {
        versionedFiles = prepareVersionedFiles(db);
    }
    catch (error) {
        console.error('创建 versioned_files 失败', error);
        try {
            db.prepare(`DROP TABLE versioned_files;`).run();
            versionedFiles = prepareVersionedFiles(db);
        }
        catch (error) {
            console.error('重试创建 versioned_files 失败', error);
        }
    }

    return versionedFiles;
};
