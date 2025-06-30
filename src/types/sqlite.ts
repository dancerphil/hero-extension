export interface CodeContextItem {
    id: number;
    nodeUri: string;
    nodeName: string;
    codeContextType: string;
    // code_context_item_proto: Buffer;
    versionedFileId: number;
    expectedSnippetCount: number;
    embedding: number[];
    embedding32: Float32Array;
    embedding8: Uint8Array;
}

export interface FileInsert {
    versionedFile: {
        corpusName: string;
        corpusRelativePath: string;
        contentHash: string;
    }
    codeContentItems: CodeContextItem[];
}
