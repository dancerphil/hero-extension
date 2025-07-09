export interface CodeContextItem {
    nodeUri: string;
    nodeName: string;
    codeContextType: number;
    expectedSnippetCount: number;
    embedding32: Float32Array;
}

export interface FileInsert {
    versionedFile: {
        corpusName: string;
        corpusRelativePath: string;
        contentHash: string;
    };
    codeContentItems: CodeContextItem[];
}
