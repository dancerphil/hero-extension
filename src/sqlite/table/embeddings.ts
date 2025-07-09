import {Database as DatabaseType, Statement} from 'better-sqlite3';

interface EmbeddingInstance {
    drop: Statement;
    count: Statement<unknown[], {count: number}>;
    insert: Statement<[Float32Array, string, number]>;
    search: Statement<[Float32Array], {id: number; cci_id: number; distance: number}>;
}

const prepareEmbeddings = (db: DatabaseType): EmbeddingInstance => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS embeddings (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            embedding       BLOB NOT NULL,
            embedding_type  TEXT NOT NULL,
            cci_id          INTEGER NOT NULL
        )
    `).run();
    return {
        drop: db.prepare('DROP TABLE embeddings;'),
        count: db.prepare('SELECT COUNT(*) as count FROM embeddings'),
        insert: db.prepare(`
            INSERT INTO embeddings (embedding, embedding_type, cci_id)
            VALUES (vec_f32(?), ?, ?)
        `),
        search: db.prepare(`
            SELECT id, cci_id, vec_distance_L2(embedding, vec_f32(?)) AS distance
            FROM embeddings
            ORDER BY distance
            LIMIT 5
        `),
    };
};

export const getEmbeddingsInstance = (db: DatabaseType): EmbeddingInstance => {
    let embeddings: EmbeddingInstance = null;
    try {
        embeddings = prepareEmbeddings(db);
    }
    catch (error) {
        console.error('创建 embeddings 失败', error);
        try {
            db.prepare('DROP TABLE embeddings;').run();
            embeddings = prepareEmbeddings(db);
        }
        catch (error) {
            console.error('重试创建 embeddings 失败', error);
        }
    }

    return embeddings;
};
