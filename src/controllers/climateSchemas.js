// ADD READING schema
export const addReadingSchema = {
  type: "object",
  required: [
    "Device Name",
    "Precipitation mm/h",
    "Time",
    "Latitude",
    "Longitude",
    "Temperature (°C)",
    "Atmospheric Pressure (kPa)",
    "Max Wind Speed (m/s)",
    "Solar Radiation (W/m2)",
    "Vapor Pressure (kPa)",
    "Humidity (%)",
    "Wind Direction (°)",
  ],
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
};

// ADD BATCH READINGS schema
export const addBatchReadingsSchema = {
  type: "object",
  required: ["batchReadings"],
  properties: {
    batchReadings: {
      type: "array",
      items: {
        type: "object",
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
};

// UPDATE READING schema
export const updateReadingSchema = {
  type: "object",
  minProperties: 1,
  additionalProperties: false,
  properties: {
    "Temperature (°C)": { type: "number" },
    "Precipitation mm/h": { type: "number" },
    "Atmospheric Pressure (kPa)": { type: "number" },
    "Max Wind Speed (m/s)": { type: "number" },
    "Solar Radiation (W/m2)": { type: "number" },
    "Vapor Pressure (kPa)": { type: "number" },
    "Humidity (%)": { type: "number" },
    "Wind Direction (°)": { type: "number" },
  },
  minProperties: 1,
};

// GET READING BY ID schema
export const getReadingByIDSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
};

// GET READINGS FROM SENSOR BY DATE AND TIME RANGE (path) schema
export const getReadingsByDateAndTimePathSchema = {
  type: "object",
  required: ["deviceName", "date", "startTime", "endTime"],
  properties: {
    deviceName: { type: "string" },
    date: {
      type: "string",
      pattern:
        "^(?:19|20)\\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[01])$",
    },
    startTime: {
      type: "string",
      pattern: "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
    },
    endTime: { type: "string", pattern: "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" },
  },
};

// GET READINGS FROM SENSOR BY DATE AND TIME RANGE (query) schema
export const getReadingsByDateAndTimeQuerySchema = {
  type: "object",
  properties: {
    page: { type: "string", pattern: "^\\d+$" },
    limit: { type: "string", pattern: "^\\d+$" },
  },
};

// GET SPECIFIC READINGS FROM SENSOR BY DATE AND HOUR schema
export const getReadingsByDateAndHourSchema = {
  type: "object",
  required: ["deviceName", "date", "hour"],
  properties: {
    deviceName: { type: "string", pattern: "^[A-Za-z_]+$" },
    date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    hour: { type: "string", pattern: "^\\d{2}$" },
  },
};

// GET MAX PRECIPITATION schema
export const getMaxPrecipitationSchema = {
  type: "object",
  required: ["deviceName", "startDate", "endDate"],
  properties: {
    deviceName: { type: "string" },
    startDate: {
      type: "string",
      pattern:
        "^(?:19|20)\\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[01])$",
    },
    endDate: {
      type: "string",
      pattern:
        "^(?:19|20)\\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[01])$",
    },
  },
};

// GET ALL READINGS WITH PAGINATION schema
export const getAllReadingsWithPaginationSchema = {
  type: "object",
  properties: {
    page: { type: "string", pattern: "^[1-9][0-9]*$" },
    limit: { type: "string", pattern: "^[1-9][0-9]*$" },
    deviceName: { type: "string", pattern: "^[A-Za-z_]+$" },
  },
};

// GET MAX READING schema
export const getMaxReadingSchema = {
  type: "object",
  required: ["measurement", "startDate", "endDate"],
  properties: {
    measurement: {
      type: "string",
    },
    // deviceName: { type: "string", pattern: "^[A-Za-z_]+$" },
    startDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    endDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
  },
};
