import elasticClient from "../db/db";

export const helloWord = async () => {
  try {
    const res = await elasticClient.search({
      index: "books",
      from: 0,
      query: {
        match_all: {},
      },
    });
    return res.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.log(error);
  }
};

export const getEntityCount = async () => {
  try {
    const res = await elasticClient.count({
      index: "books",
    });
    return res.count;
  } catch (error) {
    console.log(error);
  }
};
