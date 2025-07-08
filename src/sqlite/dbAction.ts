import {FileInsert} from "../types/sqlite";
import {getDbInstance} from "./dbInstance";

interface ParamsProcessFileInsert {
    fileList: FileInsert[]
}

export const processFileInsert = ({fileList}: ParamsProcessFileInsert) => {
    const instance = getDbInstance();

    const transaction = instance.db.transaction(() => {
        for (const file of fileList) {
            const { versionedFile, codeContentItems } = file;
            const { corpusName, corpusRelativePath, contentHash } = versionedFile;
            console.log(`处理文件: ${corpusRelativePath}`);

            try {
                const versionedFileResult = instance.versionedFiles.insert.run(
                    corpusName, corpusRelativePath, contentHash
                );

                const versionedFileId = versionedFileResult.lastInsertRowid as number;
                console.log(`文件插入成功, ID: ${versionedFileId}`);

                for (const cci of codeContentItems) {
                    const {nodeUri, nodeName, codeContextType, expectedSnippetCount, embedding, embedding32, embedding8} = cci;

                    const cciResult =  instance.codeContextItems.insert.run(
                        nodeUri,
                        nodeName,
                        codeContextType,
                        versionedFileId,
                        expectedSnippetCount
                    );
                    const cciId = cciResult.lastInsertRowid as number;

                    console.log(`cci 插入成功, ID: ${versionedFileId}`);

                    instance.embeddings.insert.run(embedding32, 'default', cciId);
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
