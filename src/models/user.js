import { ObjectId } from "mongodb";
import { db as getDb } from "../database/mongodb.js";

// GET USER BY API KEY
export const getUserByApiKey = async (apiKey) => {
  // Required due to indexing
  const db = await getDb();

  // Retrieve user by API key
  const user = await db
    .collection("users")
    .findOne({ authentication_key: apiKey });

  return user;
};

// UPDATE USER'S LAST LOGIN DATE
export const updateUserLastLogin = async (userId, lastLogin) => {
  const db = await getDb();

  await db
    .collection("users")
    .updateOne({ _id: userId }, { $set: { last_login: lastLogin } });
};

// CREATE SINGLE USER
export async function createUser(user) {
  // Required due to indexing
  const db = await getDb();

  // Delete any existing ID
  delete user.id;
  // Insert user object and return resulting promise
  return db
    .collection("users")
    .insertOne(user)
    .then((result) => {
      delete user._id;
      return { ...user, id: result.insertedId.toString() };
    });
}

// CREATE MULTIPLE USERS
export async function createManyUsers(users) {
  // Required due to indexing
  const db = await getDb();

  for (const user of users) {
    delete user.id;
  }

  db.collection("users")
    .insertMany(users)
    .then((result) => {
      for (const user of users) {
        user.id = user._id.toString();
        delete user._id;
      }
      return Promise.resolve(users);
    });
}

// GET ALL USERS WITH PAGINATION
export async function getAllUsers(page = 1, limit = 10) {
  // Required due to indexing
  const db = await getDb();

  const skip = (page - 1) * limit;

  try {
    const data = await db
      .collection("users")
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("users").countDocuments();

    return {
      success: true,
      data,
      total,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// GET USER BY ID
export async function getUserById(userId) {
  // Required due to indexing
  const db = await getDb();

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (user) {
    user.id = user._id.toString();
    delete user._id;
  }

  return user;
}

// GET USER BY EMAIL
export async function getUserByEmail(email) {
  // Required due to indexing
  const db = await getDb();

  const user = await db.collection("users").findOne({ email: email });

  if (user) {
    user.id = user._id.toString();
    delete user._id;
  }

  return user;
}

// UPDATE USERS ACCESS ROLE BY DATE RANGE
export async function updateUsersAccessRoleByDateRange(
  start_date,
  end_date,
  access_role,
  new_access_role,
) {
  // Required due to indexing
  const db = await getDb();

  const dateRangeFilter = {
    account_created: {
      $gte: start_date,
      $lte: end_date,
    },
    access_role,
  };

  const updateDocument = {
    $set: { access_role: new_access_role },
  };

  return db.collection("users").updateMany(dateRangeFilter, updateDocument);
}

// UPDATE USER BY ID
export async function updateUserById(userId, updatedUser) {
  // Required due to indexing
  const db = await getDb();

  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updatedUser },
      { returnOriginal: false },
    )
    .then((result) => {
      if (!result.value) {
        return Promise.reject("User not found");
      }
      const user = result.value;
      user.id = user._id.toString();
      delete user._id;
      return Promise.resolve(user);
    });
}

// DELETE USER BY THEIR ID
export async function deleteUser(userID) {
  // Required due to indexing
  const db = await getDb();

  return db.collection("users").deleteOne({ _id: new ObjectId(userID) });
}

// DELETE INACTIVE USERS
export async function deleteInactiveUsers(days) {
  // Required due to indexing
  const db = await getDb();

  const currentDate = new Date();
  const inactiveThreshold = new Date(
    currentDate.setDate(currentDate.getDate() - days),
  );

  const filter = {
    last_login: { $lte: inactiveThreshold.toISOString() },
    // Access_role is NOT EQUAL to "admin", to prevent admins from being deleted
    access_role: { $ne: "admin" },
  };

  return db.collection("users").deleteMany(filter);
}
