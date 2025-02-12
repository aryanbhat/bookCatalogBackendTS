import openSearchClient from "../db/db";
import { Filters } from "./search.controller";

export async function searchAggs(
  _: any,
  {
    query,
    filters,
    from = 0,
    size = 0,
  }: { query: string; filters: Filters; from: number; size: number }
): Promise<{ key: string; count: number }[]> {
  try {
    const mustQueries = [];

    if (query?.trim()) {
      mustQueries.push({
        multi_match: {
          query,
          fields: ["title^3", "author^2", "description"],
          fuzziness: "AUTO",
          minimum_should_match: "70%",
        },
      });
    }

    if (filters?.genre) {
      mustQueries.push({
        terms: {
          genres: [filters.genre],
        },
      });
    }

    if (filters?.rating) {
      mustQueries.push({
        range: {
          rating: {
            gte: filters.rating,
          },
        },
      });
    }

    if (filters?.minPrice && filters?.maxPrice) {
      mustQueries.push({
        script: {
          script: {
            source:
              "try { float price = Float.parseFloat(doc['price'].value); return price >= params.min && price <= params.max; } catch(Exception e) { return false; }",
            params: {
              min: filters.minPrice,
              max: filters.maxPrice,
            },
            lang: "painless",
          },
        },
      });
    }

    const result = await openSearchClient.search({
      index: "books",
      from,
      size: 0,
      body: {
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

    const years = (
      result.body.aggregations?.years as {
        buckets: { key: number; doc_count: number }[];
      }
    )?.buckets.map((bucket) => {
      return {
        key: String(new Date(bucket.key).getFullYear()),
        count: bucket.doc_count,
      };
    });

    return years;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Search failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during search");
  }
}
