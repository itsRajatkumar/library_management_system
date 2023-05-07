import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  CHECK_USER_EXISTS_OR_NOT,
  CREATE_USER,
  DELETE_USER,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  UPDATE_PASSWORD_BY_ID,
  UPDATE_USER_BY_ID,
} from "../queries/auth.queries.js";
import executeQuery from "../../db/executeQuery.js";

const register = async (req, res) => {
  try {
    // get username, password and role from request body
    const { username, password, role } = req.body;
    if (!username || !password) {
      // if username or password is not provided
      return res.status(400).json({
        message: "Please provide username and password",
        status: false,
      });
    }
    if (!role || (role !== "MEMBER" && role !== "LIBRARIAN")) {
      // if role is not provided or role is not MEMBER or LIBRARIAN
      return res.status(400).json({
        message: "Please provide role",
        status: false,
      });
    }

    // check if user already exists
    const user = await executeQuery(CHECK_USER_EXISTS_OR_NOT(username));
    if (user.length > 0) {
      // if user already exists
      return res.status(400).json({
        message: "User already exists",
        status: false,
      });
    }

    // if user does not exist, create a new user
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = await executeQuery(CREATE_USER(username, hash, role));
    if (newUser.affectedRows > 0) {
      // if user is created successfully
      return res.status(201).json({
        message: "User created successfully",
        status: true,
      });
    }
    // if user is not created successfully
    return res.status(400).json({
      message: "Error creating user",
      status: false,
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const login = async (req, res) => {
  try {
    // get username and password from request body
    const { username, password } = req.body;
    if (!username || !password) {
      // if username or password is not provided
      return res.status(400).json({
        message: "Please provide username and password",
        status: false,
      });
    }

    // check if user exists
    const user = await executeQuery(CHECK_USER_EXISTS_OR_NOT(username));
    if (user.length === 0) {
      // if user does not exist
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }

    // if user exists, check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      // if password is incorrect
      return res.status(400).json({
        message: "Password is incorrect",
        status: false,
      });
    }

    // if password is correct, create a token
    const token = jwt.sign(
      {
        id: user[0].id,
        username: user[0].username,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // send the token in response
    return res.status(200).json({
      message: "Login successful",
      status: true,
      token,
      role: user[0].role,
      username: user[0].username,
      userId: user[0].id,
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // get id from request params
    const { id } = req.params;

    // check if user exists
    const user = await executeQuery(GET_USER_BY_ID(id));
    if (user.length === 0) {
      // if user does not exist
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }
    // delete user
    const deletedUser = await executeQuery(DELETE_USER(id));
    if (deletedUser.affectedRows > 0) {
      // if user is deleted successfully
      return res.status(200).json({
        message: "User deleted successfully",
        status: true,
      });
    }
    // if user is not deleted successfully
    return res.status(400).json({
      message: "Error deleting user",
      status: false,
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const deleteUserByUser = async (req, res) => {
  try {
    // get id from request params
    const { id } = req.params;

    const { password } = req.body;
    if (!password) {
      // if username or password is not provided
      return res.status(400).json({
        message: "Please provide password",
        status: false,
      });
    }

    // check if user exists
    const user = await executeQuery(GET_USER_BY_ID(id));
    if (user.length === 0) {
      // if user does not exist
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }

    // if user exists, check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      // if password is incorrect
      return res.status(400).json({
        message: "Password is incorrect",
        status: false,
      });
    }

    // delete user
    const deletedUser = await executeQuery(DELETE_USER(id));
    if (deletedUser.affectedRows > 0) {
      // if user is deleted successfully
      return res.status(200).json({
        message: "User deleted successfully",
        status: true,
      });
    }
    // if user is not deleted successfully
    return res.status(400).json({
      message: "Error deleting user",
      status: false,
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // get all users
    const users = await executeQuery(GET_ALL_USERS());
    if (users.length > 0) {
      // if users are found
      return res.status(200).json({
        status: true,
        users,
      });
    }
    // if users are not found
    return res.status(400).json({
      message: "No users found",
      status: false,
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    // get id from request params
    const { id } = req.params;

    // check if user exists
    const user = await executeQuery(GET_USER_BY_ID(id));
    if (user.length === 0) {
      // if user does not exist
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }
    // if user exists
    return res.status(200).json({
      status: true,
      user: user[0],
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    // get id from request params
    const { id } = req.params;

    // get username, password and role from request body
    let { username, role } = req.body;
    if (!username && !role) {
      // if username or password or role is not provided
      return res.status(400).json({
        message: "Please provide username or Role",
        status: false,
      });
    }

    // check if user exists
    const user = await executeQuery(GET_USER_BY_ID(id));
    if (user.length === 0) {
      // if user does not exist
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }

    if (!username) {
      username = user[0].username;
    }
    if (!role) {
      role = user[0].role;
    }
    // update user
    const updatedUser = await executeQuery(
      UPDATE_USER_BY_ID(id, username, role)
    );
    if (updatedUser.affectedRows > 0) {
      // if user is updated successfully
      return res.status(200).json({
        message: "User updated successfully",
        status: true,
      });
    }
    // if user is not updated successfully
    return res.status(400).json({
      message: "Error updating user",
      status: false,
    });
  } catch (error) {
    // if there is any error
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        message: "Please provide password",
        status: false,
      });
    }
    const user = await executeQuery(GET_USER_BY_ID(id));
    if (user.length === 0) {
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await executeQuery(
      UPDATE_PASSWORD_BY_ID(id, hashedPassword)
    );
    if (updatedUser.affectedRows > 0) {
      return res.status(200).json({
        message: "Password updated successfully",
        status: true,
      });
    }
    return res.status(400).json({
      message: "Error updating password",
      status: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide old password and new password",
        status: false,
      });
    }

    const user = await executeQuery(GET_USER_BY_ID(id));
    if (user.length === 0) {
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user[0].password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Old password is incorrect",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await executeQuery(
      UPDATE_PASSWORD_BY_ID(id, hashedPassword)
    );
    if (updatedUser.affectedRows > 0) {
      return res.status(200).json({
        message: "Password updated successfully",
        status: true,
      });
    }
    return res.status(400).json({
      message: "Error updating password",
      status: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

export {
  register,
  login,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  changePassword,
  deleteUserByUser,
};
