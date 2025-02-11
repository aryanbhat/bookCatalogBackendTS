import elasticClient from "../db/db";
export async function createIndex() {
    const indexName = "books";
    try {
        const exists = await elasticClient.indices.exists({ index: indexName });
        if (exists) {
            console.log(`Index "${indexName}" already exists.`);
            return;
        }
        await elasticClient.indices.create({
            index: indexName,
            body: {
                settings: {
                    analysis: {
                        tokenizer: {
                            ngram_tokenizer: {
                                type: "ngram",
                                min_gram: 2,
                                max_gram: 10,
                                token_chars: ["letter", "digit"],
                            },
                        },
                        analyzer: {
                            ngram_analyzer: {
                                type: "custom",
                                tokenizer: "ngram_tokenizer",
                                filter: ["lowercase"],
                            },
                        },
                    },
                },
                mappings: {
                    properties: {
                        bookId: { type: "keyword" },
                        title: {
                            type: "text",
                            analyzer: "ngram_analyzer",
                            search_analyzer: "standard",
                        },
                        author: { type: "keyword" },
                        rating: { type: "float" },
                        description: {
                            type: "text",
                            analyzer: "ngram_analyzer",
                            search_analyzer: "standard",
                        },
                        language: { type: "keyword" },
                        isbn: { type: "keyword" },
                        genres: { type: "keyword" },
                        pages: { type: "keyword" },
                        publisher: { type: "text" },
                        publishDate: {
                            type: "date",
                            format: "MM/dd/yyyy",
                        },
                        awards: { type: "text" },
                        numRatings: { type: "integer" },
                        ratingsByStars: { type: "keyword" },
                        likedPercent: { type: "float" },
                        coverImg: { type: "keyword" },
                        price: {
                            type: "keyword",
                            fields: {
                                numeric: {
                                    type: "float",
                                    ignore_malformed: true,
                                },
                            },
                        },
                    },
                },
            },
        });
        console.log(`Index "${indexName}" created successfully.`);
    }
    catch (error) {
        console.error("Error creating index:", error);
    }
}
