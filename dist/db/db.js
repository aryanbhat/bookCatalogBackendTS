import { Client } from "@opensearch-project/opensearch";

const elasticClient = new Client({
    node: "https://localhost:9200",
});
// Make the function exportable
export const testConnection = async () => {
    try {
        const info = await elasticClient.info();
        console.log("Connected to Elasticsearch:", info.name);
        return true;
    }
    catch (error) {
        console.error("Elasticsearch connection error:", error);
        return false;
    }
};
export default elasticClient;
