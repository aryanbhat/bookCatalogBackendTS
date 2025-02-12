import openSearchClient from "../db/db.js";


export const getEntityCount = async () => {
  try {
    const res = await openSearchClient.count({
      index: "books",
    });
    return res.body.count;
  } catch (error) {
    console.log(error);
  }
};
