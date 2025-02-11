import express from "express";
import { connectGraphQL } from "./graphql/graphql.js";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";
import { testConnection } from "./db/db";
import { test } from "./utils/test.js";
import { createIndex } from "./utils/createIndex.js";
import { bulkUploader } from "./utils/bulkuploader.js";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

const app = express();

const graphqlServer = connectGraphQL();
await graphqlServer.start();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  "/graphql",
  cors(),
  expressMiddleware(graphqlServer, {
    context: async ({ req }) => ({ req }),
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

const initializeElasticsearch = async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("Failed to connect to openSearchClient");
    process.exit(1);
  }
  // await createIndex();
  // await bulkUploader();
  // await test();
};

initializeElasticsearch();

app.listen(port, () =>
  console.log("Server is working on Port:" + port + " in " + envMode + " Mode.")
);
