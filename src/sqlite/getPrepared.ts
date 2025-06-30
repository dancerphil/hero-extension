import {Database as DatabaseType} from 'better-sqlite3';

export const prepareEmbeddingsCreate = (db: DatabaseType) => db.prepare(`
    CREATE TABLE IF NOT EXISTS embeddings
    (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        embedding       BLOB NOT NULL,
        embedding_type  TEXT NOT NULL,
        cci_id          INTEGER NOT NULL
    )
`);

export const prepareEmbeddingsInsert = (db: DatabaseType) => db.prepare(`
    INSERT INTO embeddings (embedding, embedding_type, cci_id)
    VALUES (vec_f32(?), ?, ?)
`);

export const prepareEmbeddingsDrop = (db: DatabaseType) => db.prepare(`
    DROP TABLE embeddings;
`);

export const prepareEmbeddingsCount = (db: DatabaseType) => db.prepare(`
    SELECT COUNT(*) as count FROM embeddings
`);

// 根据向量检索
export const prepareEmbeddingsSearch = (db: DatabaseType) => db.prepare(`
    SELECT id, cci_id, vec_distance_L2(embedding, vec_f32(?)) AS distance
    FROM embeddings
    ORDER BY distance
    LIMIT 5
`);

export const prepareVersionedFilesCreate = (db: DatabaseType) => db.prepare(`
    CREATE TABLE IF NOT EXISTS versioned_files
    (
        id                   INTEGER PRIMARY KEY AUTOINCREMENT,
        corpus_name          TEXT NOT NULL,
        corpus_relative_path TEXT NOT NULL,
        content_hash         BLOB NOT NULL
    )
`);

export const prepareVersionedFilesInsert = (db: DatabaseType) => db.prepare(`
    INSERT INTO versioned_files (corpus_name, corpus_relative_path, content_hash)
    VALUES (?, ?, ?)
`);

export const prepareVersionedFilesGet = (db: DatabaseType) => db.prepare(`
    SELECT id, content_hash
    FROM versioned_files
    WHERE corpus_name = ? AND corpus_relative_path = ?
`);

export const prepareVersionedFilesDrop = (db: DatabaseType) => db.prepare(`
    DROP TABLE versioned_files;
`);

export const prepareCodeContextItemsCreate = (db: DatabaseType) => db.prepare(`
    CREATE TABLE IF NOT EXISTS code_context_items
    (
        id                     INTEGER PRIMARY KEY AUTOINCREMENT,
        node_uri               TEXT    NOT NULL,
        node_name              TEXT    NOT NULL,
        code_context_type      TEXT    NOT NULL,
        versioned_file_id      INTEGER NOT NULL,
        expected_snippet_count INTEGER NOT NULL
    )
`);
export const prepareCodeContextItemsInsert = (db: DatabaseType) => db.prepare(`
    INSERT INTO code_context_items (node_uri, node_name, code_context_type, versioned_file_id,
                                    expected_snippet_count)
    VALUES (?, ?, ?, ?, ?)
`);

export const prepareCodeContextItemsSelect = (db: DatabaseType) => db.prepare(`
    SELECT node_name
    FROM code_context_items
    WHERE id IN (?, ?, ?, ?, ?)
`);

export const prepareCodeContextItemsDrop = (db: DatabaseType) => db.prepare(`
    DROP TABLE code_context_items;
`);
