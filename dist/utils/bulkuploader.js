import elasticClient from "../db/db.js";
import { books } from "../json/archive.js";
import { transformDate } from "./dateTransformer.js";
export async function bulkUploader() {
    const indexName = "books";
    const booksLength = books.length;
    const chunkSize = 1000;
    console.log(`Starting bulk upload of ${booksLength} books...`);
    let successCount = 0;
    let errorCount = 0;
    for (let i = 0; i < booksLength; i += chunkSize) {
        const chunk = books.slice(i, i + chunkSize);
        const body = chunk.flatMap((book) => [
            { index: { _index: indexName } },
            {
                ...book,
                publishDate: transformDate(book.publishDate),
                pages: Number(book.pages),
                price: Number(book.price),
            },
        ]);
        try {
            const response = await elasticClient.bulk({ body });
            if (response.errors) {
                const failedItems = response.items.filter((item) => item.index?.error);
                errorCount += failedItems.length;
                successCount += chunk.length - failedItems.length;
                console.log(`Chunk ${i / chunkSize + 1}: ${failedItems.length} errors`);
                failedItems.slice(0, 3).forEach((item) => {
                    console.error("Error details:", item.index?.error);
                });
            }
            else {
                successCount += chunk.length;
            }
            console.log(`Progress: ${i + chunk.length} of ${booksLength} processed`);
            console.log(`Success: ${successCount}, Errors: ${errorCount}`);
        }
        catch (error) {
            console.error(`Error uploading chunk starting at ${i}:`, error);
            errorCount += chunk.length;
        }
    }
    console.log("Bulk upload completed");
    console.log(`Final results - Success: ${successCount}, Errors: ${errorCount}`);
}
