import express from "express";
import cors from "cors";

import booksRouter from "./src/books/books-routes.js";

console.log("SECRET: ", process.env.DB_USER);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/books", booksRouter);

app.listen(3000, () => console.log("listening on port 3000"));
