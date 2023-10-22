import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import climateDataController from "./controllers/climateData.js";
import userController from "./controllers/users.js";
import docsRouter from "./middleware/swagger-doc.js";
import { validateErrorMiddleware } from "./middleware/validator.js";

// Enable obfuscation of the sensitive deets
dotenv.config();

// Create express application
const app = express();
const port = process.env.PORT;

// Enable middleware to parse JSON requests
app.use(express.json());

// Enable cross-origin resources sharing (CORS)
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost",
        `http://localhost:${process.env.PORT}`,
        "https://www.google.com",
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

// TODO: DELETE ME
app.use((req, res, next) => {
  console.log(`🤖🤖🤖 [SERVER.JS] Request received: ${req.method} ${req.path}`);
  next();
});
// TODO: ===============================================

// Swagger documentation pages
app.use(docsRouter);

// Controllers
app.use(climateDataController);
app.use(userController);

// Validation error handling middleware (must be after controllers)
app.use(validateErrorMiddleware);

// Test the MongoDB connection
import { testConnection } from "./database/mongodb.js";
testConnection();

// Start listening for API requests
// TODO: delete /docs
app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}/docs`);
});
