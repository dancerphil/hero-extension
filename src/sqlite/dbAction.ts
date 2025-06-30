import {FileInsert} from "../types/sqlite";
import {getDb} from "./db";
import {
    prepareCodeContextItemsInsert,
    prepareEmbeddingsInsert,
    prepareVersionedFilesInsert
} from "./getPrepared";

interface ParamsProcessFileInsert {
    fileList: FileInsert[]
}

// interface Options {
//     batchSize?: number;
//     skipUnchangedFiles?: boolean;
//     onProgress?: (processed: number, total: number) => void;
// }

export const processFileInsert = ({fileList}: ParamsProcessFileInsert) => {
    // const { batchSize = 50, skipUnchangedFiles = true, onProgress } = options;

    const db = getDb();
    const versionedFilesInsert = prepareVersionedFilesInsert(db);
    const codeContextItemsInsert = prepareCodeContextItemsInsert(db);
    const embeddingsInsert = prepareEmbeddingsInsert(db);

    const transaction = db.transaction(() => {
        for (const file of fileList) {
            const { versionedFile, codeContentItems } = file;
            const { corpusName, corpusRelativePath, contentHash } = versionedFile;
            console.log(`处理文件: ${corpusRelativePath}`);

            try {
                const versionedFileResult = versionedFilesInsert.run(
                    corpusName, corpusRelativePath, contentHash
                );

                const versionedFileId = versionedFileResult.lastInsertRowid as number;
                console.log(`文件插入成功, ID: ${versionedFileId}`);

                for (const cci of codeContentItems) {
                    const {nodeUri, nodeName, codeContextType, expectedSnippetCount, embedding, embedding32, embedding8} = cci;

                    const cciResult =  codeContextItemsInsert.run(
                        nodeUri,
                        nodeName,
                        codeContextType,
                        versionedFileId,
                        expectedSnippetCount
                    );
                    const cciId = cciResult.lastInsertRowid as number;

                    console.log(`cci 插入成功, ID: ${versionedFileId}`);

                    embeddingsInsert.run(embedding32, 'default', cciId);
                }

                console.log(`${corpusRelativePath} 处理完成`);

            } catch (error) {
                console.error(`处理文件失败 ${corpusRelativePath}:`, error);
                throw error; // 抛出错误以回滚事务
            }
        }
    });

    // 执行事务
    transaction();
    console.log(`所有文件处理完成，共处理 ${fileList.length} 个文件`);
};
