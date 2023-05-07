const CHECK_USER_EXISTS_OR_NOT = (username) =>
  `SELECT * FROM users WHERE username="${username}"`;

const CREATE_USER = (username, password, role) =>
  `INSERT INTO users (username, password, role) VALUES ("${username}", "${password}", "${role}")`;

const DELETE_USER = (id) => `DELETE FROM users WHERE id=${id}`;
const GET_ALL_USERS = () => `SELECT * FROM users where role="MEMBER"`;
const GET_USER_BY_ID = (id) => `SELECT * FROM users WHERE id=${id}`;
const UPDATE_USER_BY_ID = (id, username, role) =>
  `UPDATE users SET username="${username}", role="${role}" WHERE id=${id}`;

const UPDATE_PASSWORD_BY_ID = (id, password) =>
  `UPDATE users SET password="${password}" WHERE id=${id}`;
export {
  CHECK_USER_EXISTS_OR_NOT,
  CREATE_USER,
  DELETE_USER,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  UPDATE_USER_BY_ID,
  UPDATE_PASSWORD_BY_ID,
};
