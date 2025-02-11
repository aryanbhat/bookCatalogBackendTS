import elasticClient from "../db/db.js";
export async function getGenres() {
    const result = await elasticClient.search({
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
    const genresAgg = result.aggregations?.genres;
    return genresAgg?.buckets?.map((bucket) => {
        return bucket.key;
    });
}
export async function getYears() {
    const result = await elasticClient.search({
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
    const yearsAgg = result.aggregations?.years;
    return yearsAgg?.buckets?.map((bucket) => {
        return {
            key: new Date(bucket.key).getFullYear(),
            count: bucket.doc_count,
        };
    });
}
