import { bookDetails } from "../../controllers/bookDetails.controller.js";
import { search } from "../../controllers/search.controller.js";
export const graphQLResolver = {
    Query: {
        search: search,
        bookDetails: bookDetails,
    },
};
