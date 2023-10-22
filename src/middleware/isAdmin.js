// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.access_role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Requires admin privileges." });
  }

  next();
};

export default isAdmin;
