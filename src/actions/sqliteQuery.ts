import vscode from "vscode";
import {getDbInstance} from '../sqlite/dbInstance';
import {embedCodeSnippets} from "../utils/embedding";

const sqliteQuery = async() => {
    const {embeddings, codeContextItems} = getDbInstance();

    const countResult = embeddings.count.get();
    const count = countResult.count;

    const [embedding] = await embedCodeSnippets(['export const apiGetReflowLabel = createIcodeInterface<void, string[]>(\n']);
    const embeddingResult = embeddings.search.all(new Float32Array(embedding)) as any[];
    const cciResult = codeContextItems.select.all(embeddingResult.map(item => item.cci_id)) as any[];

    vscode.window.showInformationMessage(`Search results (in ${count}): \n\n${cciResult.map(i => i.node_name).join('\n\n')}`);
};

export const sqliteQueryAction = {
    command: {
        command: 'hero.sqliteQuery',
        title: 'sqlite 查询',
    },
    callback: sqliteQuery,
};
