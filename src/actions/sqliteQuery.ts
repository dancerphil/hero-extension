import vscode from "vscode";
import {getDb} from '../sqlite/db';
import {
    prepareCodeContextItemsSelect,
    prepareEmbeddingsCount,
    prepareEmbeddingsSearch,
    prepareVersionedFilesGet
} from "../sqlite/getPrepared";
import {embedCodeSnippets} from "../utils/embedding";

const sqliteQuery = async() => {
    const db = getDb();

    const countResult = prepareEmbeddingsCount(db).get() as { count: number };
    const count = countResult.count;

    const [embedding] = await embedCodeSnippets(['export const apiGetReflowLabel = createIcodeInterface<void, string[]>(\n']);
    const embeddingResult = prepareEmbeddingsSearch(db).all(new Float32Array(embedding)) as any[];
    const cciResult = prepareCodeContextItemsSelect(db).all(embeddingResult.map(item => item.cci_id)) as any[];

    vscode.window.showInformationMessage(`Search results (in ${count}): \n\n${cciResult.map(i => i.node_name).join('\n\n')}`);
};

export const sqliteQueryAction = {
    command: {
        command: 'hero.sqliteQuery',
        title: 'sqlite 查询',
    },
    callback: sqliteQuery,
};
