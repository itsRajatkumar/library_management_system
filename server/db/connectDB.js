// connect to mysql database
import mysql from "mysql";
import {
  CREATE_BOOKS_TABLE,
  CREATE_USERS_TABLE,
} from "../v1/queries/createTable.queries.js";
import executeQuery from "./executeQuery.js";

// import environment variables
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: "../.env" });

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  port: process.env.MYSQL_DB_PORT,
});

// open the MySQL connection
connection.connect(async (error) => {
  if (error) throw error;
  //   if database connection is successful, create the table if it doesn't exist
  const create_user = await executeQuery(CREATE_USERS_TABLE);
  const create_books = await executeQuery(CREATE_BOOKS_TABLE);
  if (create_user && create_books)
    console.log("Successfully created the tables.");
  else console.log("Error creating the tables.");

  console.log("Successfully connected to the database.");
});

export default connection;
