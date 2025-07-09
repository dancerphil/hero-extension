import {FileInsert} from './types.js';
import {getDbInstance} from './dbInstance.js';

interface ParamsProcessFileInsert {
    fileList: FileInsert[];
}

export const processFileInsert = async ({fileList}: ParamsProcessFileInsert) => {
    const instance = getDbInstance();

    // const count = instance.embeddings.count.get();

    // console.log(`初始 embeddings 数量 ${count?.count}`);

    const transaction = instance.db.transaction(() => {
        for (const file of fileList) {
            const {versionedFile, codeContentItems} = file;
            const {corpusName, corpusRelativePath, contentHash} = versionedFile;
            // console.log(`处理文件: ${corpusRelativePath}`);

            try {
                const versionedFileResult = instance.versionedFiles.insert.run(
                    corpusName, corpusRelativePath, contentHash,
                );

                const versionedFileId = versionedFileResult.lastInsertRowid as number;
                // console.log(`文件插入成功, ID: ${versionedFileId}`);

                for (const cci of codeContentItems) {
                    const {nodeUri, nodeName, codeContextType, expectedSnippetCount, embedding32} = cci;

                    const cciResult = instance.codeContextItems.insert.run(
                        nodeUri,
                        nodeName,
                        codeContextType,
                        versionedFileId,
                        expectedSnippetCount,
                    );
                    const cciId = cciResult.lastInsertRowid as number;

                    // console.log(`CCI 插入成功, ID: ${cciId}`);

                    instance.embeddings.insert.run(embedding32, 'default', cciId);

                    // console.log(`Embedding 插入成功, ID: ${embeddingResult.lastInsertRowid}`);
                }

                // console.log(`文件处理完成: ${corpusRelativePath}`);
            }
            catch (error) {
                console.error(`处理文件失败: ${corpusRelativePath}`);
                throw error; // 抛出错误以回滚事务
            }
        }
    });

    try {
        transaction();
        // 获取最终数量
        const finalCount = instance.embeddings.count.get();
        console.error(`处理完成! 最终 embeddings 数量: ${finalCount?.count}`);
    }
    catch (error) {
        console.error('事务处理失败，所有操作已回滚:', error);
    }
};
