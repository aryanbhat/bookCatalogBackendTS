import elasticClient from "../db/db.js";
export async function search(_, { query, filters, size = 10, from = 0, }) {
    try {
        const mustQueries = [];
        // Build query filters (same as your previous implementation)
        if (query?.trim()) {
            mustQueries.push({
                multi_match: {
                    query,
                    fields: ["title^3", "author^2", "description"],
                    fuzziness: "AUTO",
                    minimum_should_match: "70%",
                },
            });
        }
        if (filters?.genre) {
            mustQueries.push({
                terms: {
                    genres: [filters.genre],
                },
            });
        }
        if (filters?.rating) {
            mustQueries.push({
                range: {
                    rating: {
                        gte: filters.rating,
                    },
                },
            });
        }
        if (filters?.minPrice && filters?.maxPrice) {
            mustQueries.push({
                range: {
                    price: {
                        gte: filters.minPrice,
                        lte: filters.maxPrice,
                    },
                },
            });
        }
        const result = await elasticClient.search({
            index: "books",
            from,
            size,
            body: {
                query: {
                    bool: {
                        must: mustQueries,
                    },
                },
                track_total_hits: true,
            },
        });
        const bookArr = result.hits.hits.map((hit) => ({
            ...(typeof hit._source === "object" ? hit._source : {}),
            score: hit._score,
        }));
        return {
            books: bookArr,
            total: Math.min(result.hits.total.value, 10000 - 12),
            pages: Math.ceil(Math.min(result.hits.total.value, 10000 - 12) / size),
        };
    }
    catch (error) {
        console.error("Search error:", error);
        throw new Error(`Search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export async function countDocuments(_, { query, filters, size }) {
    try {
        const mustQueries = [];
        if (query?.trim()) {
            mustQueries.push({
                multi_match: {
                    query,
                    fields: ["title^3", "author^2", "description"],
                    fuzziness: "AUTO",
                    minimum_should_match: "70%",
                },
            });
        }
        if (filters?.genre) {
            mustQueries.push({
                terms: {
                    genres: [filters.genre],
                },
            });
        }
        if (filters?.rating) {
            mustQueries.push({
                range: {
                    rating: {
                        gte: filters.rating,
                    },
                },
            });
        }
        if (filters?.minPrice && filters?.maxPrice) {
            mustQueries.push({
                script: {
                    script: {
                        source: "try { float price = Float.parseFloat(doc['price'].value); return price >= params.min && price <= params.max; } catch(Exception e) { return false; }",
                        params: {
                            min: filters.minPrice,
                            max: filters.maxPrice,
                        },
                        lang: "painless",
                    },
                },
            });
        }
        const result = await elasticClient.count({
            index: "books",
            query: {
                bool: {
                    must: mustQueries,
                },
            },
            scroll: "1m",
        });
        console.log(result);
        const total = Math.min(result.count, 9800);
        return {
            total,
            pages: Math.ceil(total / size),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Count failed: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during count");
    }
}
