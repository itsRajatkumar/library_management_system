import jwt from "jsonwebtoken";

export function checkAuth(role) {
  return (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(401)
        .json({ message: "You are not authenticated", status: false });
    }

    const token = authorization.split(" ")[1];
    if (token === "" || token === undefined) {
      return res
        .status(401)
        .json({ message: "You are not authenticated", status: false });
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (user) {
        if (!role.includes(user.role)) {
          return res.status(401).json({
            message: "You are not authorized to access this resource",
            status: false,
          });
        }
        req.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
        next();
      } else {
        return res
          .status(401)
          .json({ message: "Unauthorized access", status: false });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid token", status: false });
    }
  };
}
