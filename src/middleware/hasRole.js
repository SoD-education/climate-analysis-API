const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!allowedRoles.includes(user.access_role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Requires proper privileges." });
    }

    next();
  };
};

export default hasRole;
