import { Router } from "express";
import apiKeyAuth from "../middleware/apiKeyAuth.js";
import hasRole from "../middleware/hasRole.js";
import { validate } from "../middleware/validator.js";
import * as climateDataModel from "../models/climateData.js";
import { Reading } from "../models/readingObject.js";
import { convertMeasurementName } from "../utils/measurement.js";
import { convertSensorName } from "../utils/sensor.js";
import * as schema from "./climateSchemas.js";

const climateDataController = Router();

/*
 * In order to avoid routing issues:
 * Endpoints must be ordered in terms of specificity
 */

// TODO: DELETE ME
// DELETE ALL TEST_SENSOR RECORDS endpoint
climateDataController.delete(
  "/readings/delete-test-sensor",
  async (req, res) => {
    // #swagger.summary = 'Delete all Test_Sensor readings'

    const result = await climateDataModel.deleteAllTestSensorRecords();

    if (result.success) {
      res.status(200).json({
        status: 200,
        message: "Successfully deleted all Test_Sensor climate data",
        deletedCount: result.deletedCount,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Failed to delete all Test_Sensor climate data",
        error: result.error,
      });
    }
  },
);
// TODO: =======================================================

/*
 * POST requests
 */

// INSERT SINGLE WEATHER READING endpoint
climateDataController.post(
  "/readings/insert_single_reading",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({ body: schema.addReadingSchema }),
  (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Add a new reading'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.requestBody = {
    description: "Add a single reading to the database",
    content: {
      'application/json': {
        schema: {
          "Device Name": { type: "string" },
          "Precipitation mm/h": { type: "number" },
          Time: {
            type: "object",
            required: ["$date"],
            properties: {
              $date: {
                type: "object",
                required: ["$numberLong"],
                properties: {
                  $numberLong: { type: "string" },
                },
              },
            },
          },
          Latitude: { type: "number" },
          Longitude: { type: "number" },
          "Temperature (°C)": { type: "number" },
          "Atmospheric Pressure (kPa)": { type: "number" },
          "Max Wind Speed (m/s)": { type: "number" },
          "Solar Radiation (W/m2)": { type: "number" },
          "Vapor Pressure (kPa)": { type: "number" },
          "Humidity (%)": { type: "number" },
          "Wind Direction (°)": { type: "number" }
        },
        "example": {
          "Device Name": "Test_Sensor",
          "Precipitation mm/h": 0.011,
          "Time": {
            "$date": {
              "$numberLong": "1620359044000"
            }
          },
          "Latitude": 111.11111,
          "Longitude": -11.11111,
          "Temperature (°C)": 11.11,
          "Atmospheric Pressure (kPa)": 111.11,
          "Max Wind Speed (m/s)": 1.11,
          "Solar Radiation (W/m2)": 111.11,
          "Vapor Pressure (kPa)": 1.11,
          "Humidity (%)": 11.11,
          "Wind Direction (°)": 111.1
        }
      }
    }
} */

    /* #swagger.responses[201] = {
      description: 'Reading successfully added',
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
            status: 201,
            message: 'Successfully added new reading with ID: 60af5d1b837ec948c038ab84',
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to add new reading',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
              error: { type: 'string', description: 'Detailed error message' },
            },
          },
          example: {
            status: 500,
            message: 'Failed to add new reading',
            error: 'Error details',
          },
        },
      },
    } */

    const readingData = req.body;

    // Trigger: Check if the temperature is greater than 60 degrees Celsius
    if (readingData["Temperature (°C)"] > 60) {
      res.status(400).json({
        status: 400,
        message: "Invalid temperature reading. Document not added.",
      });
      return;
    }

    // Convert the reading data into an object
    const reading = Reading(
      null,
      readingData["Device Name"],
      readingData["Precipitation mm/h"],
      readingData["Time"],
      readingData["Latitude"],
      readingData["Longitude"],
      readingData["Temperature (°C)"],
      readingData["Atmospheric Pressure (kPa)"],
      readingData["Max Wind Speed (m/s)"],
      readingData["Solar Radiation (W/m2)"],
      readingData["Vapor Pressure (kPa)"],
      readingData["Humidity (%)"],
      readingData["Wind Direction (°)"],
    );

    // Insert reading into the db
    climateDataModel

      .addReading(reading)
      .then((result) => {
        res.status(201).json({
          status: 201,
          message: `Successfully added new reading with ID: ${result.id}`,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to add new user",
          error: error.message,
        });
      });
  },
);

// ADD BATCH READINGS endpoint
climateDataController.post(
  "/readings/create_batch_readings",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({ body: schema.addBatchReadingsSchema }),
  (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Add batch readings'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.requestBody = {
      description: "Add batch readings to the database",
      content: {
        'application/json': {
          schema: {
            batchReadings: "array"
          },
          example: {
            batchReadings: [
              {
                "Device Name": "Test_Sensor",
                "Precipitation mm/h": 0.011,
                "Time": {
                  "$date": {
                    "$numberLong": "1620359044000"
                  }
                },
                "Latitude": 111.11111,
                "Longitude": -11.11111,
                "Temperature (°C)": 11.11,
                "Atmospheric Pressure (kPa)": 111.11,
                "Max Wind Speed (m/s)": 1.11,
                "Solar Radiation (W/m2)": 111.11,
                "Vapor Pressure (kPa)": 1.11,
                "Humidity (%)": 11.11,
                "Wind Direction (°)": 111.1
              },
              {
                "Device Name": "Test_Sensor",
                "Precipitation mm/h": 0.011,
                "Time": {
                  "$date": {
                    "$numberLong": "1620359044000"
                  }
                },
                "Latitude": 111.11111,
                "Longitude": -11.11111,
                "Temperature (°C)": 11.11,
                "Atmospheric Pressure (kPa)": 111.11,
                "Max Wind Speed (m/s)": 1.11,
                "Solar Radiation (W/m2)": 111.11,
                "Vapor Pressure (kPa)": 1.11,
                "Humidity (%)": 11.11,
                "Wind Direction (°)": 111.1
              }
            ]
          }
        }
      }
    } */

    /* #swagger.responses[201] = {
      description: 'Successfully created batch climate readings',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              batchReadings: {
                type: 'array',
                description: 'Array of created batch climate readings',
                items: {
                  type: 'object',
                  properties: {
                    "Device Name": { type: "string" },
                    "Precipitation mm/h": { type: "number" },
                    Time: {
                      type: "object",
                      required: ["$date"],
                      properties: {
                        $date: {
                          type: "object",
                          required: ["$numberLong"],
                          properties: {
                            $numberLong: { type: "string" },
                          },
                        },
                      },
                    },
                    Latitude: { type: "number" },
                    Longitude: { type: "number" },
                    "Temperature (°C)": { type: "number" },
                    "Atmospheric Pressure (kPa)": { type: "number" },
                    "Max Wind Speed (m/s)": { type: "number" },
                    "Solar Radiation (W/m2)": { type: "number" },
                    "Vapor Pressure (kPa)": { type: "number" },
                    "Humidity (%)": { type: "number" },
                    "Wind Direction (°)": { type: "number" },
                  },
                },
              },
            },
          },
          example: {
            status: 201,
            message: 'Successfully created batch climate readings',
            batchReadings: [
              {
                "Device Name": "Test_Sensor",
                "Precipitation mm/h": 0.011,
                "Time": {
                  "$date": {
                    "$numberLong": "1620359044000"
                  }
                },
                "Latitude": 111.11111,
                "Longitude": -11.11111,
                "Temperature (°C)": 11.11,
                "Atmospheric Pressure (kPa)": 111.11,
                "Max Wind Speed (m/s)": 1.11,
                "Solar Radiation (W/m2)": 111.11,
                "Vapor Pressure (kPa)": 1.11,
                "Humidity (%)": 11.11,
                "Wind Direction (°)": 111.1
              },
              {
                "Device Name": "Test_Sensor",
                "Precipitation mm/h": 0.011,
                "Time": {
                  "$date": {
                    "$numberLong": "1620359044000"
                  }
                },
                "Latitude": 111.11111,
                "Longitude": -11.11111,
                "Temperature (°C)": 11.11,
                "Atmospheric Pressure (kPa)": 111.11,
                "Max Wind Speed (m/s)": 1.11,
                "Solar Radiation (W/m2)": 111.11,
                "Vapor Pressure (kPa)": 1.11,
                "Humidity (%)": 11.11,
                "Wind Direction (°)": 111.1
              },
            ],
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to create batch climate readings',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
            },
          },
          example: {
            status: 500,
            message: 'Failed to create batch climate readings',
          },
        },
      },
    } */

    const batchReadingsData = req.body.batchReadings;

    // Convert the batch climate readings into objects
    const batchReadings = batchReadingsData.map((reading) =>
      Reading(
        null,
        reading["Device Name"],
        reading["Precipitation mm/h"],
        reading["Time"],
        reading["Latitude"],
        reading["Longitude"],
        reading["Temperature (°C)"],
        reading["Atmospheric Pressure (kPa)"],
        reading["Max Wind Speed (m/s)"],
        reading["Solar Radiation (W/m2)"],
        reading["Vapor Pressure (kPa)"],
        reading["Humidity (%)"],
        reading["Wind Direction (°)"],
      ),
    );

    // Insert batch climate readings into the database
    climateDataModel
      .addBatchReadings(batchReadings)
      .then((batchReadings) => {
        res.status(201).json({
          status: 201,
          message: "Successfully created batch climate readings",
          batchReadings: batchReadings,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to create batch climate readings",
        });
      });
  },
);

/*
 * PUT requests
 */

// UPDATE READING BY ID endpoint
climateDataController.put(
  "/readings/:id",
  apiKeyAuth,
  hasRole("admin", "teacher"),
  validate({
    params: schema.getReadingByIDSchema,
    body: schema.updateReadingSchema,
  }),
  async (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Update a specific measurement by ID'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.requestBody = {
      description: "Update specific measurement",
      content: {
        'application/json': {
          schema: {
            "Precipitation mm/h": { type: "number" },
          },
          "example": {
            "Precipitation mm/h": 0.022,
          }
        }
      }
  } */

    /* #swagger.responses[201] = {
    description: 'Successfully updated the reading',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'integer', description: 'HTTP status code' },
            message: { type: 'string', description: 'Success message' },
            oldValue: { type: 'object', description: 'The old reading value' },
            newValue: { type: 'object', description: 'The updated reading value' },
          },
        },
      },
    },
  } */

    /* #swagger.responses[404] = {
    description: 'No reading found with the specified ID',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'integer', description: 'HTTP status code' },
            message: { type: 'string', description: 'Error message' },
          },
        },
        example: {
          status: 404,
          message: 'No reading found with the specified ID',
        },
      },
    },
  } */

    /* #swagger.responses[500] = {
    description: 'Failed to update the reading',
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
          message: 'Failed to update the reading',
          error: 'Error details',
        },
      },
    },
  } */

    const id = req.params.id;
    const updateData = req.body;

    try {
      const result = await climateDataModel.updateReadingById(id, updateData);
      if (result.oldValue) {
        res.status(201).json({
          status: 201,
          message: "Successfully updated the reading",
          oldValue: result.oldValue,
          newValue: result.newValue,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "No reading found with the specified ID",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to update the reading",
        error: error.message,
      });
    }
  },
);

/*
 * DELETE requests
 */

/*
 * GET requests
 */

// GET MAX READING
climateDataController.get(
  "/readings/max/:measurement/:startDate/:endDate",
  validate({ params: schema.getMaxReadingSchema }),
  async (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Get max readings in a given date range'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully retrieved max measurement for the specified date range',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              data: {
                type: 'object',
                properties: {
                  Time: { type: 'object', description: 'Time of the reading' },
                  Measurement: { type: 'number', description: 'Max measurement value' },
                },
              },
            },
          },
        },
      },
    } */

    /* #swagger.responses[404] = {
      description: 'No data found for the specified date range',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Error message' },
            },
          },
          example: {
            status: 404,
            message: 'No data found for the specified date range',
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to retrieve max measurement for the specified date range',
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
            message: 'Failed to retrieve max measurement for the specified date range',
            error: 'Error details',
          },
        },
      },
    } */

    const { startDate, endDate } = req.params;

    // Allow user-friendly measurement type
    const measurement = convertMeasurementName(req.params.measurement);

    // Allow user-friendly sensor names
    const deviceName = req.query.deviceName
      ? convertSensorName(req.query.deviceName)
      : undefined;

    climateDataModel
      .getMaxReading("Temperature", startDate, endDate)
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({
            status: 200,
            message: `Successfully retrieved max ${measurement} for the specified date range`,
            data: result,
          });
        } else {
          res.status(404).json({
            status: 404,
            message: "No data found for the specified date range",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to retrieve max ${measurement} for the specified date range`,
          error: error.message,
        });
      });
    // climateDataModel
    //   .getMaxReading(measurement, startDate, endDate)
    //   .then((result) => {
    //     if (result) {
    //       res.status(200).json({
    //         status: 200,
    //         message: `Successfully retrieved max ${measurement} for the specified date range`,
    //         data: result,
    //         // data: {
    //         //   "Device Name": result["Device Name"],
    //         //   Time: result["Time"],
    //         //   [measurement]: result[measurement],
    //         // },
    //       });
    //     } else {
    //       res.status(404).json({
    //         status: 404,
    //         message: "No data found for the specified date range",
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     res.status(500).json({
    //       status: 500,
    //       message: `Failed to retrieve max ${measurement} for the specified date range`,
    //       error: error.message,
    //     });
    //   });
  },
);

// GET READINGS FROM SENSOR BY DATE AND TIME RANGE endpoint
climateDataController.get(
  "/readings/:deviceName/:date/:startTime/:endTime",
  validate({
    params: schema.getReadingsByDateAndTimePathSchema,
    query: schema.getReadingsByDateAndTimeQuerySchema,
  }),
  async (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Get readings from a specific sensor at a given date and time range'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully retrieved readings by date and time range',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              totalCount: { type: 'integer', description: 'Total count of readings' },
              totalPages: { type: 'integer', description: 'Total number of pages' },
              currentPage: { type: 'integer', description: 'Current page number' },
              data: { type: 'array', description: 'Array of readings', items: { type: 'object' } },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to retrieve readings by date and time range',
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

    const { date, startTime, endTime } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Convert the strings from the query into numbers
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;

    // Allow for user-friendly sensor names
    const sensor = convertSensorName(req.params.deviceName);

    climateDataModel
      .getReadingsByDateAndTime(
        sensor,
        date,
        startTime,
        endTime,
        pageNumber,
        limitNumber,
      )
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Successfully retrieved readings by date and time range",
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          data: result.data,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to retrieve readings by date and time range",
          error: error.message,
        });
      });
  },
);

// GET SPECIFIC READINGS FROM SENSOR BY DATE AND HOUR endpoint
climateDataController.get(
  "/readings/:deviceName/:date/:hour",
  validate({ params: schema.getReadingsByDateAndHourSchema }),
  async (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Get temperature, atmospheric pressure, radiation, and precipitation readings for a specific sensor by date and hour'

    // #swagger.description = 'The hour should be provided in 24-hour format (HH), without including the minutes.'

    /* #swagger.parameters['x-api-key'] = { 
      in: 'header',
      description: 'Authentication key',
      required: true,
      type:'string'
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully retrieved readings by date and time',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              data: { type: 'object', description: 'Object containing the readings data' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to retrieve readings by date and time',
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

    const { date, hour } = req.params;

    // Convert sensor name
    const sensor = convertSensorName(req.params.deviceName);

    try {
      const result = await climateDataModel.getReadingsByDateAndHour(
        sensor,
        date,
        hour,
      );
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved readings by date and time",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve readings by date and time",
        error: error.message,
      });
    }
  },
);

// GET ALL READINGS WITH PAGINATION endpoint
climateDataController.get(
  "/readings",
  validate({ query: schema.getAllReadingsWithPaginationSchema }),
  async (req, res) => {
    // #swagger.tags = ['Readings']

    // #swagger.summary = 'Get all readings with pagination'

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
        type: 'string'
    } */

    /* #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Limit per page',
        required: false,
        type: 'string'
    } */

    /* #swagger.parameters['deviceName'] = {
        in: 'query',
        description: 'Sensor name (optional)',
        required: false,
        type: 'string'
    } */

    /* #swagger.responses[200] = {
      description: 'Successfully retrieved readings with pagination',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: { type: 'integer', description: 'HTTP status code' },
              message: { type: 'string', description: 'Success message' },
              data: { type: 'object', description: 'Object containing the readings data' },
            },
          },
        },
      },
    } */

    /* #swagger.responses[500] = {
      description: 'Failed to retrieve readings with pagination',
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
    const deviceName = req.query.deviceName;

    // Allow for user-friendly sensor names
    const sensor = convertSensorName(deviceName);

    climateDataModel
      .getAllReadingsWithPagination(page, limit, sensor)
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Successfully retrieved readings with pagination",
          data: result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to retrieve readings with pagination",
          error: error.message,
        });
      });
  },
);

export default climateDataController;
