import { Router } from "express";

const mainRouter = Router();

import AuthRoutes from "./routes/auth.routes.js";
import BooksRouter from "./routes/books.routes.js";

mainRouter.use("/auth", AuthRoutes);
mainRouter.use("/books", BooksRouter);

export default mainRouter;
