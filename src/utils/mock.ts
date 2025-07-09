import {readFile} from 'fs/promises';
import {resolve} from 'path';
import {CodeContextItem, FileInsert} from '../sqlite/types';
import {embedCodeSnippets} from './embedding';
import {getCwd} from './getCwd';

interface Params {
    files: string[];
}

interface Result {
    fileList: FileInsert[];
}

const mockCci = async (content: string): Promise<CodeContextItem> => {
    const [embedding] = await embedCodeSnippets([content]);
    return {
        nodeUri: content.slice(0, 20),
        nodeName: content,
        codeContextType: 1,
        expectedSnippetCount: 3,
        embedding32: new Float32Array(embedding),
    };
};

export const apiGetCCI = async ({files}: Params): Promise<Result> => {
    const cwd = getCwd();
    const fileList: FileInsert[] = [];
    for (const file of files) {
        const content = await readFile(resolve(cwd, file), 'utf-8');

        const codeSegments = content.split('\n\n');

        const fileItem: FileInsert = {
            versionedFile: {
                corpusName: 'example_corpus',
                corpusRelativePath: file,
                contentHash: content,
            },
            codeContentItems: [],
        };
        for (const segment of codeSegments) {
            const cci = await mockCci(segment);
            fileItem.codeContentItems.push(cci);
        }
        fileList.push(fileItem);
    }
    return {fileList};
};
