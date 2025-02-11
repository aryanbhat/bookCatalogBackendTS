import openSearchClient from "../db/db.js";

export async function bookDetails(_: any, { bookId }: { bookId: string }) {
  try {
    const res = await openSearchClient.search({
      index: "books",
      body: {
        query: {
          match: {
            bookId: bookId,
          },
        },
      },
    });
    if (res.body.hits.hits.length > 0) {
      return res.body.hits.hits[0]._source;
    } else {
      throw new Error("Book not found");
    }
  } catch (error) {
    throw new Error("Error fetching book details");
  }
}
