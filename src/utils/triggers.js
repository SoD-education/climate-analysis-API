import { getUserByApiKey, updateUserLastLogin } from "../models/user.js";

// Trigger: Update user's last login date when they successfully query the database
export async function updateLastLogin(apiKey) {
  if (typeof apiKey !== "string") {
    console.error("TRIGGER: Error updating last login: Invalid API key type.");
    return;
  }

  try {
    const user = await getUserByApiKey(apiKey);

    if (user) {
      await updateUserLastLogin(user._id, new Date());
    } else {
      console.error(`TRIGGER: Error updating last login: User not found.`);
    }
  } catch (error) {
    console.error(
      `TRIGGER: Error updating last login for user:`,
      error.message,
    );
  }
}
