import {Client } from "@opensearch-project/opensearch";

const openSearchClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "admin", 
    password: "Lameloball@666"
  },
  ssl: {
    rejectUnauthorized: false
}
});

export const testConnection = async () => {
  try {
    const info = await openSearchClient.info();
    console.log("Connected to openSearchClient:", info.body.name);
    return true;
  } catch (error) {
    console.error("openSearchClient connection error:", error);
    return false;
  }
};

export default openSearchClient;
