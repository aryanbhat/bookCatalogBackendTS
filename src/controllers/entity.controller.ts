import openSearchClient from "../db/db.js";

export async function getGenres() {
  const result = await openSearchClient.search({
    index: "books",
    body: {
      size: 0,
      aggs: {
        genres: {
          terms: { field: "genres" },
        },
      },
    },
  });

  const genresAgg = result.body.aggregations?.genres as {
    buckets: Array<{ key: string; doc_count: number }>;
  };

  return genresAgg?.buckets?.map((bucket) => {
    return bucket.key;
  });
}

export async function getYears() {
  const result = await openSearchClient.search({
    index: "books",
    body: {
      size: 0,
      aggs: {
        years: {
          date_histogram: {
            field: "publishDate",
            calendar_interval: "year",
            format: "yyyy",
          },
        },
      },
    },
  });

  const yearsAgg = result.body.aggregations?.years as {
    buckets: Array<{ key: string; doc_count: number }>;
  };

  return yearsAgg?.buckets?.map((bucket) => {
    return {
      key: new Date(bucket.key).getFullYear(),
      count: bucket.doc_count,
    };
  });
}
