import elasticClient from "../db/db.js";

export async function test() {
  try {
    const res = await elasticClient.indices.delete({
      index: "books",
    });
    console.log(res);
  } catch (error) {
    console.error("Error performing aggregation:", error);
  }
}
