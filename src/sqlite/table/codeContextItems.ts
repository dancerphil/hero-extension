import {Database as DatabaseType, Statement} from 'better-sqlite3';

interface CodeContextItemsInstance {
    insert: Statement<[string, string, number, number, number]>;
    select: Statement<number[], {node_name: string}>;
    drop: Statement;
}

const prepareCodeContextItems = (db: DatabaseType): CodeContextItemsInstance => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS code_context_items (
            id                     INTEGER PRIMARY KEY AUTOINCREMENT,
            node_uri               TEXT    NOT NULL,
            node_name              TEXT    NOT NULL,
            code_context_type      INTEGER NOT NULL,
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
        drop: db.prepare('DROP TABLE code_context_items;'),
    };
};

export const getCodeContextItemsInstance = (db: DatabaseType): CodeContextItemsInstance => {
    let codeContextItems: CodeContextItemsInstance = null;
    try {
        codeContextItems = prepareCodeContextItems(db);
    }
    catch (error) {
        console.error('创建 code_context_items 失败', error);
        try {
            db.prepare('DROP TABLE code_context_items;').run();
            codeContextItems = prepareCodeContextItems(db);
        }
        catch (error) {
            console.error('重试创建 code_context_items 失败', error);
        }
    }

    return codeContextItems;
};
