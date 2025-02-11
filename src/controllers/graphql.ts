import openSearchClient from "../db/db.js";

export const helloWord = async () => {
  try {
    const res = await openSearchClient.search({
      index: "books",
      from: 0,
      query: {
        match_all: {},
      },
    });
    return res.body.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.log(error);
  }
};

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
