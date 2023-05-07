import { Router } from "express";
import {
  register,
  login,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  changePassword,
  deleteUserByUser,
} from "../controllers/auth.controllers.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/login", (req, res) => login(req, res));

authRouter.post("/register", (req, res) => register(req, res));

authRouter.delete(
  "/delete/:id",
  checkAuth(["MEMBER", "LIBRARIAN"]),
  (req, res) => deleteUser(req, res)
);

authRouter.delete(
  "/delete-by-user/:id",
  checkAuth(["MEMBER", "LIBRARIAN"]),
  (req, res) => deleteUserByUser(req, res)
);

authRouter.get("/users", checkAuth(["LIBRARIAN"]), (req, res) =>
  getAllUsers(req, res)
);

authRouter.get("/users/:id", checkAuth(["LIBRARIAN"]), (req, res) =>
  getUserById(req, res)
);

authRouter.put("/update/:id", checkAuth(["LIBRARIAN"]), (req, res) =>
  updateUser(req, res)
);

authRouter.put("/update-password/:id", checkAuth(["LIBRARIAN"]), (req, res) =>
  updatePassword(req, res)
);

authRouter.put(
  "/change-password",
  checkAuth(["MEMBER", "LIBRARIAN"]),
  (req, res) => changePassword(req, res)
);

export default authRouter;
