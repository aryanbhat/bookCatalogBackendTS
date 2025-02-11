export const graphQLSchema = `#graphql

input Filters {
    genre : String,
    rating : Float,
    minPrice : Float,
    maxPrice : Float,
}

type SearchResult {
    books: [Book], 
    total: Int,
    pages: Int,
}

type Query {
    search(query: String, filters: Filters, from: Int, size: Int): SearchResult
    bookDetails(bookId: String): Book
}


type Book {
    bookId: String, 
    title: String, 
    author: [String], 
    rating: Float, 
    description: String, 
    language: String, 
    isbn: String, 
    genres: [String], 
    pages: String, 
    publisher: String, 
    publishDate: String, 
    awards: String, 
    numRatings: Int, 
    ratingsByStars: [Int], 
    likedPercent: Float, 
    coverImg: String, 
    price: String,
    score: Float,
}



`;
