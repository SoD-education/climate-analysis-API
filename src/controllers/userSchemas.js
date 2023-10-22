// CREATE USER schema
export const createUserSchema = {
  type: "object",
  required: [
    // "account_created",
    "email",
    "password",
    "access_role",
    "firstname",
    "lastname",
    // "last_login",
    // "authentication_key",
  ],
  properties: {
    account_created: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    access_role: { type: "string" },
    firstname: { type: "string" },
    lastname: { type: "string" },
    last_login: { type: "string" },
    authentication_key: { type: "string" },
  },
};

// CREATE MULTIPLE USERS schema
export const createManyUsersSchema = {
  type: "object",
  required: ["users"],
  properties: {
    users: {
      type: "array",
      items: {
        type: "object",
        required: ["email", "password", "access_role", "firstname", "lastname"],
        properties: {
          account_created: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          access_role: { type: "string" },
          firstname: { type: "string" },
          lastname: { type: "string" },
          last_login: { type: "string" },
          authentication_key: { type: "string" },
        },
      },
    },
  },
};

// GET ALL USERS WITH PAGINATION schema
export const getUsersSchema = {
  type: "object",
  properties: {},
};

// GET USER BY ID schema
export const getUserByIDSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
    },
  },
};

// GET USER BY EMAIL schema
export const getUserByEmailSchema = {
  type: "object",
  required: ["email"],
  properties: {
    id: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    },
  },
};

// UPDATE USERS ACCESS ROLE BY DATE RANGE schema
export const updateUsersAccessRoleByDateRangeSchema = {
  type: "object",
  properties: {
    start_date: { type: "string" },
    end_date: { type: "string" },
    access_role: { type: "string" },
    new_access_role: { type: "string" },
  },
};

// UPDATE ADMIN schema
export const updateAdminSchema = {
  type: "object",
  required: [
    "account_created",
    "email",
    "password",
    "access_role",
    "firstname",
    "lastname",
    "last_login",
    "authentication_key",
  ],
  properties: {
    account_created: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    access_role: { type: "string" },
    firstname: { type: "string" },
    lastname: { type: "string" },
    last_login: { type: "string" },
    authentication_key: { type: "string" },
  },
};

// DELETE USER BY ID schema
export const deleteUserSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
    },
  },
};

// DELETE INACTIVE USERS schema
export const deleteInactiveUsersSchema = {
  type: "object",
  required: ["days"],
  properties: {
    days: { type: "integer" },
  },
};
