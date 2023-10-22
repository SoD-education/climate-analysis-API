import bcrypt from "bcryptjs";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import apiKeyAuth from "../middleware/apiKeyAuth.js";
import hasRole from "../middleware/hasRole.js";
import { validate } from "../middleware/validator.js";
import * as userModel from "../models/user.js";
import { User } from "../models/userObject.js";
import * as triggers from "../utils/triggers.js";
import * as schema from "./userSchemas.js";

const userController = Router();

// TODO: DELETE ME
// CREATE TEST ACCOUNT
// userController.post(
//   "/users/create_test_user",
//   apiKeyAuth,
//   hasRole("admin"),
//   validate({ body: schema.createUserSchema }),
//   (req, res) => {
//     // #swagger.tags = ['Test']

//     /* #swagger.parameters['x-api-key'] = { 
//       in: 'header',
//       description: 'Authentication key',
//       required: true,
//       type:'string'
//     } */

//     /* #swagger.requestBody = {
//         description: "Create user",
//         content: {
//           'application/json': {
//             schema: {
//               "email": { type: "string" },
//               "password": { type: "string" },
//               "access_role": { type: "string" },
//               "firstname": { type: "string" },
//               "lastname": { type: "string" },
//               "last_login": { type: "string" }
//             },
//             "example": {
//               "email": "karen@school.com",
//               "password": "karen",
//               "access_role": "student",
//               "firstname": "karen",
//               "lastname": "karenerson",
//               "last_login": "2023-02-02T03:44:04.000+00:00"
//             }
//           }
//         }
//     } */

//     /* #swagger.responses[200] = {
//       description: 'Successfully created new user',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'object',
//             properties: {
//               status: { type: 'integer', description: 'HTTP status code' },
//               message: { type: 'string', description: 'Success message' },
//             },
//           },
//           example: {
//             status: 200,
//             message: 'Successfully created new user Test with ID: 1',
//           },
//         },
//       },
//     } */

//     /* #swagger.responses[500] = {
//       description: 'Failed to create new user',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'object',
//             properties: {
//               status: { type: 'integer', description: 'HTTP status code' },
//               message: { type: 'string', description: 'Error message' },
//               error: { type: 'string', description: 'Error details' },
//             },
//           },
//           example: {
//             status: 500,
//             message: 'Failed to create new user',
//             error: 'Error details',
//           },
//         },
//       },
//     } */

//     const now = new Date().toISOString();

//     const userData = req.body;

//     // Generate a UUID-based API key
//     const apiKey = uuidv4();

//     // hash the password if it isn't already hashed
//     if (!userData.password.startsWith("$2a")) {
//       userData.password = bcrypt.hashSync(userData.password);
//     }

//     // Convert the user into an object
//     const newUser = User(
//       null,
//       now,
//       userData.email,
//       userData.password,
//       userData.access_role,
//       userData.firstname,
//       userData.lastname,
//       "2021-02-02T03:44:04.000+00:00",
//       apiKey,
//     );

//     // Insert user into the database
//     userModel
//       .createUser(newUser)
//       .then((result) => {
//         res.status(200).json({
//           status: 200,
//           message: `Successfully created new user ${result.firstname} with ID: ${result.id}`,
//           apiKey: newUser.authentication_key,
//         });
//       })
//       .catch((error) => {
//         res.status(500).json({
//           status: 500,
//           message: "Failed to create new user",
//           error: error.message,
//         });
//       });
//   },
// );
// TODO: DELETE ME

// TEST ADMIN ACCESS
// userController.get("/auth/login", apiKeyAuth, (req, res) => {
//   // #swagger.tags = ['Authentication']

//   // #swagger.summary = 'Login with API key'

//   /* #swagger.parameters['x-api-key'] = { 
//       in: 'header',
//       description: 'Authentication key',
//       required: true,
//       type:'string'
//     } */

//   /* #swagger.responses[200] = {
//       description: 'Successfully logged in',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'object',
//             properties: {
//               status: { type: 'integer', description: 'HTTP status code' },
//               message: { type: 'string', description: 'Success message' },
//             },
//           },
//         },
//       },
//     } */

//   /* #swagger.responses[401] = {
//       description: 'Unauthorized - Invalid API key or not an admin',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'object',
//             properties: {
//               status: { type: 'integer', description: 'HTTP status code' },
//               message: { type: 'string', description: 'Error message' },
//             },
//           },
//         },
//       },
//     } */

//   const isUserAdmin = req.headers["x-api-key"];

//   userModel
//     .getUserByApiKey(isUserAdmin)
//     .then((user) => {
//       if (!user || user.access_role !== "admin") {
//         res.status(401).json({
//           status: 401,
//           message: "Unauthorized - Invalid API key or not an admin",
//         });
//       } else {
//         res.status(200).json({
//           status: 200,
//           message: "Successfully logged in",
//         });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         status: 500,
//         message: "Error processing the login request",
//         error: error.message,
//       });
//     });
// });

// CREATE SINGLE USER endpoint
userController.post(
  "/users/create_new_user",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({ body: schema.createUserSchema }),
  (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Create new user'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.requestBody = {
        description: "Create user",
        content: {
          'application/json': {
            schema: {
              "email": { type: "string" },
              "password": { type: "string" },
              "access_role": { type: "string" },
              "firstname": { type: "string" },
              "lastname": { type: "string" },
            },
            "example": {
              "email": "test@school.com",
              "password": "test",
              "access_role": "student",
              "firstname": "Test",
              "lastname": "Testerson",
            }
          }
        }
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully created new user',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
            },
          },
          example: {
            status: 200,
            message: 'Successfully created new user Test with ID: 1',
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to create new user',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
          example: {
            status: 500,
            message: 'Failed to create new user',
            error: 'Error details',
          },
        },
      },
    } */

    const now = new Date().toISOString();

    const userData = req.body;

    // hash the password if it isn't already hashed
    if (!userData.password.startsWith("$2a")) {
      userData.password = bcrypt.hashSync(userData.password);
    }

    // Generate a UUID-based API key
    const apiKey = uuidv4();

    // Convert the user into an object
    const newUser = User(
      null,
      now,
      userData.email,
      userData.password,
      userData.access_role,
      userData.firstname,
      userData.lastname,
      null,
      apiKey,
    );

    // Insert user into the database
    userModel
      .createUser(newUser)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: `Successfully created new user ${result.firstname} with ID: ${result.id}`,
          apiKey: newUser.authentication_key,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to create new user",
          error: error.message,
        });
      });
  },
);

// CREATE MULTIPLE USERS endpoint
userController.post(
  "/users/create_multiple_users",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({ body: schema.createManyUsersSchema }),
  (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Create multiple users'

    /* #swagger.parameters['authentication_key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.requestBody = {
        description: "Create multiple users",
        content: {
          'application/json': {
            schema: {
              users: "array"
            },
            example: {
              users: [
                {
                  "email": "test1@school.com",
                  "password": "test",
                  "access_role": "student",
                  "firstname": "Test1",
                  "lastname": "Testerson",
                },
                {
                  "email": "test2@school.com",
                  "password": "test",
                  "access_role": "student",
                  "firstname": "Test2",
                  "lastname": "Testerson",
                },
              ]
            }
          }
        }
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully created new users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              users: { type: 'array', description: 'Array of created users', items: { type: 'object' } },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to create new users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
          example: {
            status: 500,
            message: 'Failed to create new users',
            error: 'Error details',
          },
        },
      },
    } */

    const now = new Date().toISOString();

    const usersData = req.body.users;

    // Convert the users into objects with hashed passwords
    const users = usersData.map((userData) => {
      // hash the password if it isn't already hashed
      if (!userData.password.startsWith("$2a")) {
        userData.password = bcrypt.hashSync(userData.password);
      }

      // Generate a UUID-based API key
      const apiKey = uuidv4();

      return User(
        null,
        now,
        userData.email,
        userData.password,
        userData.access_role,
        userData.firstname,
        userData.lastname,
        null,
        apiKey,
      );
    });

    // Insert users into the database
    userModel
      .createManyUsers(users)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Successfully created new users",
          users: result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to create new users",
          error: error.message,
        });
      });
  },
);

// GET ALL USERS WITH PAGINATION endpoint
userController.get(
  "/users/get_all_users",
  apiKeyAuth,
  validate({ body: schema.getUsersSchema }),
  async (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Get all users with pagination'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            required: false,
            type: 'integer'
        } */

    /* #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Number of users per page',
            required: false,
            type: 'integer'
        } */

    /* #swagger.responses[200] = {
      description: 'Successfully retrieved users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              data: { type: 'array', description: 'Array of user objects', items: { type: 'object' } },
              total: { type: 'integer', description: 'Total number of users' },
              currentPage: { type: 'integer', description: 'Current page number' },
              totalPages: { type: 'integer', description: 'Total number of pages' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to get users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
        },
      },
    } */

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const apiKey = req.headers["x-api-key"];

    const result = await userModel.getAllUsers(page, limit);

    if (result.success) {
      // Trigger on update/edit: Update last login date for querying user
      await triggers.updateLastLogin(apiKey);

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved users",
        data: result.data,
        total: result.total,
        currentPage: page,
        totalPages: Math.ceil(result.total / 10),
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Failed to get users",
        error: error.message,
      });
    }
  },
);

// GET USER BY ID endpoint
userController.get(
  "/users/:id",
  apiKeyAuth,
  validate({ params: schema.getUserByIDSchema }),
  (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Get user by ID'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.parameters['id'] = {
          in: 'path',
          description: 'User ID',
          required: true,
          type: 'string'
      } */

    /* #swagger.responses[200] = {
      description: 'Successfully fetched user by their ID',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              user: { type: 'object', description: 'Object containing the user data' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[404] = {
      description: 'Failed to get user by their ID',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Error retrieving user by their ID',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
        },
      },
    } */

    const userId = req.params.id;

    userModel
      .getUserById(userId)
      .then((user) => {
        if (!user) {
          res.status(404).json({
            status: 404,
            message: "Failed to get user by their ID",
          });
        } else {
          res.status(200).json({
            status: 200,
            message: "Successfully fetched user by their ID",
            user: user,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Error retrieving user by their ID",
          error: error.message,
        });
      });
  },
);

// GET USER BY EMAIL endpoint
userController.get(
  "/users/email/:email",
  apiKeyAuth,
  validate({ params: schema.getUserByEmailSchema }),
  (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Get user by email address'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.parameters['email'] = {
          in: 'path',
          description: 'User email',
          required: true,
          type: 'string'
      } */

    /* #swagger.responses[200] = {
      description: 'Successfully fetched user by their email',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              user: { type: 'object', description: 'Object containing the user data' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[404] = {
      description: 'Failed to get user by their email',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Error retrieving user by their email',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
        },
      },
    } */

    const userEmail = req.params.email;

    userModel
      .getUserByEmail(userEmail)
      .then((user) => {
        if (!user) {
          res.status(404).json({
            status: 404,
            message: "Failed to get user by their email",
          });
        } else {
          res.status(200).json({
            status: 200,
            message: "Successfully fetched user by their email",
            user: user,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Error retrieving user by their email",
          error: error.message,
        });
      });
  },
);

// UPDATE USERS ACCESS ROLE BY DATE RANGE endpoint
userController.patch(
  "/users/update_access_role_by_date_range",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({
    body: schema.updateUsersAccessRoleByDateRangeSchema,
  }),
  async (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Update user access roles by date range'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.parameters['start_date'] = {
            in: 'query',
            description: 'Start date',
            required: false,
            type: 'string'
        } */

    /* #swagger.parameters['end_date'] = {
            in: 'query',
            description: 'End date',
            required: false,
            type: 'string'
        } */

    /* #swagger.parameters['access_role'] = {
            in: 'query',
            description: 'Old access role',
            required: false,
            type: 'string'
        } */

    /* #swagger.parameters['new_access_role'] = {
            in: 'query',
            description: 'New access role',
            required: false,
            type: 'string'
        } */

    /* #swagger.responses[200] = {
      description: 'Successfully updated users access level by date range',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              modifiedCount: { type: 'integer', description: 'Number of users whose access level has been updated' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to update users access level by date range',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
        },
      },
    } */

    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const access_role = req.query.access_role;
    const new_access_role = req.query.new_access_role;

    const apiKey = req.headers["x-api-key"];

    userModel
      .updateUsersAccessRoleByDateRange(
        start_date,
        end_date,
        access_role,
        new_access_role,
      )
      // .then becomes async to handle the updateLastLogin function
      .then(async (result) => {
        // Trigger on update/edit: Update last login date for querying user
        await triggers.updateLastLogin(apiKey);
        res.status(200).json({
          status: 200,
          message: "Successfully updated users access level by date range",
          modifiedCount: result.modifiedCount,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to update users access level by date range",
          error: error.message,
        });
      });
  },
);

// UPDATE ADMIN ACCOUNT (PUT) endpoint
userController.put(
  "/users/:id/update_admin",
  apiKeyAuth,
  hasRole("admin"),
  validate({ body: schema.updateAdminSchema }),
  (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Update an admin account'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'Admin user ID',
            required: true,
            type: 'string'
        } */

    /* #swagger.requestBody = {
        description: "Create user",
        content: {
          'application/json': {
            schema: {
              "account_created": {type: "string"},
              "email": { type: "string" },
              "password": { type: "string" },
              "access_role": { type: "string" },
              "firstname": { type: "string" },
              "lastname": { type: "string" },
              "last_login": { type: "string" },
              "authentication_key": { type: "string" },
            },
            "example": {
              "account_created": "2021-01-01T03:44:04.000+00:00",
              "email": "admin@school.com",
              "password": "test",
              "access_role": "admin",
              "firstname": "Test",
              "lastname": "Testerson",
              "last_login": "2021-02-02T03:44:04.000+00:00",
              "authentication_key": "authkey",
            }
          }
        }
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully updated admin account',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              user: { type: 'string', description: 'Updated user\'s first name' },
            },
          },
          example: {
            status: 200,
            message: 'Successfully updated admin account',
            user: 'Test',
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to update admin account',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
          example: {
            status: 500,
            message: 'Failed to update admin account',
            error: 'Error details',
          },
        },
      },
    } */

    const userId = req.params.id;
    const updatedAdmin = req.body;

    userModel
      .updateUserById(userId, updatedAdmin)
      .then(async (result) => {
        // Trigger on update/edit: Update last login date for querying user
        await triggers.updateLastLogin(apiKey);
        res.status(200).json({
          status: 200,
          message: "Successfully updated admin account",
          user: result.firstname,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to update admin account",
          error: error.message,
        });
      });
  },
);

// DELETE USER endpoint
userController.delete(
  "/users/delete_user_by_id/:id",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({ params: schema.deleteUserSchema }),
  (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Delete user'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully deleted user',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to delete user',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Error details' },
            },
          },
        },
      },
    } */

    const userID = req.params.id;

    userModel
      .deleteUser(userID)
      .then(async (result) => {
        // Trigger on update/edit: Update last login date for querying user
        await triggers.updateLastLogin(apiKey);
        res.status(200).json({
          status: 200,
          message: "Successfully deleted user",
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to delete user",
          error: error.message,
        });
      });
  },
);

// DELETE INACTIVE USERS endpoint
userController.delete(
  "/users/delete_inactive_users",
  apiKeyAuth,
  hasRole("admin"),
  validate({
    body: schema.deleteInactiveUsersSchema,
  }),
  async (req, res) => {
    // #swagger.tags = ['Users']

    // #swagger.summary = 'Delete inactive users'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully deleted inactive users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              deletedCount: { type: 'integer', description: 'Number of inactive users deleted' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to delete inactive users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
            },
          },
        },
      },
    } */

    const { days } = req.body;

    userModel
      .deleteInactiveUsers(days)
      .then(async (result) => {
        // Trigger on update/edit: Update last login date for querying user
        await triggers.updateLastLogin(apiKey);
        res.status(200).json({
          status: 200,
          message: "Successfully deleted inactive users",
          deletedCount: result.deletedCount,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to delete inactive users",
        });
      });
  },
);

export default userController;
