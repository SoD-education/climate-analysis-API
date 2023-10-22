import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "Climate Data API",
    description: "JSON REST API for tracking climate data",
  },
  host: "localhost:8080",
  basePath: "",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./docs/swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
