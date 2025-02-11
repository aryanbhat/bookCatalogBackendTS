import openSearchClient from "../db/db.js";

export async function test() {
  try {
    const res = await openSearchClient.indices.delete({
      index: "books",
    });
    console.log(res.body.acknowledged);
  } catch (error) {
    console.error("Error performing aggregation:", error);
  }
}
