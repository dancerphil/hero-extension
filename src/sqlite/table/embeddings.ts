import {Database as DatabaseType} from 'better-sqlite3';

const prepareEmbeddings = (db: DatabaseType) => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS embeddings (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            embedding       BLOB NOT NULL,
            embedding_type  TEXT NOT NULL,
            cci_id          INTEGER NOT NULL
        )
    `).run();
    return {
        drop: db.prepare(`DROP TABLE embeddings;`),
        count: db.prepare<unknown[], {count: number}>(`SELECT COUNT(*) as count FROM embeddings`),
        insert: db.prepare<[Float32Array, string, number]>(`
            INSERT INTO embeddings (embedding, embedding_type, cci_id)
            VALUES (vec_f32(?), ?, ?)
        `),
        search: db.prepare(`
            SELECT id, cci_id, vec_distance_L2(embedding, vec_f32(?)) AS distance
            FROM embeddings
            ORDER BY distance
            LIMIT 5
        `)
    };
};


export const getEmbeddingsInstance = (db: DatabaseType) => {
    let embeddings: ReturnType<typeof prepareEmbeddings> | null = null;
    try {
        embeddings = prepareEmbeddings(db);
    }
    catch (error) {
        console.error('创建 embeddings 失败', error);
        try {
            db.prepare(`DROP TABLE embeddings;`).run();
            embeddings = prepareEmbeddings(db);
        }
        catch (error) {
            console.error('重试创建 embeddings 失败', error);
        }
    }

    return embeddings;
};
