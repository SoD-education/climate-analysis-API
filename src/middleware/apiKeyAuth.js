import { getUserByApiKey } from "../models/user.js";

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ message: "No API key provided" });
  }

  const user = await getUserByApiKey(apiKey);
  if (!user) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  req.user = user;
  next();
};

export default apiKeyAuth;
