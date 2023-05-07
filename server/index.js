// load env variables
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// import required modules
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// import database connection
import db from "./db/connectDB.js";

// create express app
const app = express();
const port = 3000;

// enable cors
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// import the routes
import Routes from "./v1/index.js";

app.use("/api/v1", Routes);

app.get("*", (req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// listen the app on the port
app.listen(port, () => console.log(`App listening on port ${port}!`));
