import elasticClient from "../db/db";
export async function bookDetails(_, { bookId }) {
    try {
        const res = await elasticClient.search({
            index: "books",
            body: {
                query: {
                    match: {
                        bookId: bookId,
                    },
                },
            },
        });
        if (res.hits.hits.length > 0) {
            return res.hits.hits[0]._source;
        }
        else {
            throw new Error("Book not found");
        }
    }
    catch (error) {
        throw new Error("Error fetching book details");
    }
}
