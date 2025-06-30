import {pipeline} from '@xenova/transformers';

// 加载轻量级嵌入模型 (约 90MB)
const extractorPromise = pipeline('feature-extraction',
    'Xenova/all-MiniLM-L6-v2',  // 多语言模型，适合代码
    { quantized: true }         // 使用量化版本减少内存
);

type Embedding = number[];

// 处理代码的嵌入函数
export async function embedCodeSnippets(codeSnippets: string[]) {
    const extractor = await extractorPromise;
    // 生成嵌入向量
    const embeddings: Embedding[] = [];
    for (const code of codeSnippets) {
        const output = await extractor(code, {
            pooling: 'mean',         // 平均池化策略
            normalize: true          // 归一化向量
        });
        const embedding: Embedding = Array.from(output.data);
        embeddings.push(embedding);
    }

    return embeddings;
}

// 计算余弦相似度
export function cosineSimilarity(vecA: Embedding, vecB: Embedding) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
}
