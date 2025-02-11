import openSearchClient from "../db/db.js";
import { Book } from "../types/type.js";

export type Filters = {
  genre?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
};

export async function search(
  _: any,
  {
    query,
    filters,
    size = 10,
    from = 0,
  }: { query: string; filters: Filters; size?: number; from?: number }
) {
  try {
    const mustQueries = [];

    // Build query filters (same as your previous implementation)
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
        range: {
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
      });
    }

    const result = await openSearchClient.search({
      index: "books",
      from,
      size,
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
        track_total_hits: true,
      },
    });

    const bookArr = result.body.hits.hits.map(
      (hit) =>
        ({
          ...(typeof hit._source === "object" ? hit._source : {}),
          score: hit._score,
        } as Book)
    );

    const total = typeof result.body.hits.total === "number"
      ? result.body.hits.total
      : result.body.hits.total?.value || 0;

    return {
      books: bookArr,
      total,
      pages: Math.ceil(total / size),
    };
  } catch (error: unknown) {
    console.error("Search error:", error);
    throw new Error(
      `Search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
