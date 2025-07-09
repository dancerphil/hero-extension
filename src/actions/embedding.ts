import {cosineSimilarity, embedCodeSnippets} from '../utils/embedding';
import vscode from 'vscode';

const testEmbedding = async () => {
    const codeExamples = [
        `function sum(a, b) { return a + b; }`,
        `const multiply = (x, y) => x * y;`,
        `class Calculator { add(n1, n2) { return n1 + n2 } }`,
    ];

    const embeddings = await embedCodeSnippets(codeExamples);

    console.log('嵌入维度:', embeddings[0].length); // 384 维向量
    console.log('第一个代码嵌入:', embeddings[0].slice(0, 5)); // 预览前5个值

    const [embed1, embed2] = await embedCodeSnippets([
        'function add(a, b) { return a + b }',
        'function sum(x, y) { return x + y }',
    ]);

    vscode.window.showInformationMessage(`相似度: ${cosineSimilarity(embed1, embed2).toFixed(4)}`);
};

export const embeddingAction = {
    command: {
        command: 'hero.embedding',
        title: 'embedding',
    },
    callback: testEmbedding,
};
