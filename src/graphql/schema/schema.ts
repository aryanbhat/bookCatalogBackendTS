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

//this is the query which you can do Like i have two queries one is search and another is bookData 
//and then there is parameters ye Query main hota hain ye sab query kar sakte ho app and then mutation hota jo kuch change karne ke lie karte hain 
//to ye clone karo then npm i aur npm run dev karke jaha bhi jayega us se /grpahql pe jao aur dikhega aapko ki query kya hain kaise karunga sab kuch

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
