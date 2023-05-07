import connection from "./connectDB.js";

const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

export default executeQuery;
