import { ObjectId } from "mongodb";
import { db as getDb } from "../database/mongodb.js";

// TODO: DELETE ME
// DELETE ALL TEST_SENSOR RECORDS
export async function deleteAllTestSensorRecords() {
  const db = await getDb();
  try {
    const result = await db
      .collection("climate-data")
      .deleteMany({ "Device Name": "Test_Sensor" });
    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
// TODO: =======================================================

// ADD READING
export async function addReading(reading) {
  const db = await getDb();
  // Ensure that new data does not have existing ID
  delete reading.id;
  // Insert the reading object
  return db
    .collection("climate-data")
    .insertOne(reading)
    .then((result) => {
      delete reading._id;
      return { ...reading, id: result.insertedId.toString() };
    });
}

// ADD BATCH READINGS
export async function addBatchReadings(batchReadings) {
  const db = await getDb();
  batchReadings.forEach((reading) => {
    delete reading.id;
  });

  return db
    .collection("climate-data")
    .insertMany(batchReadings)
    .then((result) => {
      for (const reading of batchReadings) {
        reading.id = reading._id.toString();
        delete reading._id;
      }
      return Promise.resolve(batchReadings);
    });
}

// UPDATE READING BY ID
export async function updateReadingById(id, updateData) {
  const db = await getDb();
  const filter = { _id: new ObjectId(id) };
  const update = { $set: updateData };

  // Find the document before the update and return it
  const oldReading = await db
    .collection("climate-data")
    .findOneAndUpdate(filter, update);

  // Create a response object with both old and new values
  const response = {
    oldValue: {},
    newValue: {},
  };

  for (const key in updateData) {
    response.oldValue[key] = oldReading.value[key];
    response.newValue[key] = updateData[key];
  }

  return response;
}

// GET READINGS BY SENSOR NAME WITH PAGINATION
export async function getClimateDataBySensor(sensorName, page) {
  const db = await getDb();
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const data = await db
      .collection("climate-data")
      .find({ "Device Name": sensorName })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db
      .collection("climate-data")
      .countDocuments({ "Device Name": sensorName });

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

// GET READINGS FROM SENSOR BY DATE AND TIME RANGE
export async function getReadingsByDateAndTime(
  deviceName,
  date,
  startTime,
  endTime,
  page,
  limit,
) {
  const db = await getDb();

  // Convert date and time strings to JavaScript Date objects
  const startDate = new Date(`${date}T${startTime}:00.000Z`);
  const endDate = new Date(`${date}T${endTime}:00.000Z`);

  const query = {
    "Device Name": deviceName,
    // Time is indexed
    Time: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const totalCount = await db.collection("climate-data").countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const result = await db
    .collection("climate-data")
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    totalCount,
    totalPages,
    currentPage: page,
    data: result,
  };
}

// GET SPECIFIC READINGS FROM SENSOR BY DATE AND HOUR
export async function getReadingsByDateAndHour(deviceName, date, hour) {
  const db = await getDb();

  // Convert date and time strings to JavaScript Date objects
  const startDate = new Date(`${date}T${hour}:00:00.000Z`);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  const result = await db.collection("climate-data").findOne(
    {
      "Device Name": deviceName,
      Time: {
        $gte: startDate,
        $lt: endDate,
      },
    },
    {
      // Projection is used to satisfy a test requirement
      projection: {
        "Temperature (°C)": 1,
        "Atmospheric Pressure (kPa)": 1,
        "Solar Radiation (W/m2)": 1,
        "Precipitation mm/h": 1,
      },
    },
  );

  return result;
}

// GET MAX (value) RECORDED
export async function getMaxReading(measurement, startDate, endDate) {
  const db = await getDb();

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const matchStage = {
    $match: {
      Time: {
        $gte: start,
        $lt: end,
      },
    },
  };

  const groupStage = {
    $group: {
      _id: "$Device Name",
      maxMeasurement: { $max: "$Temperature (°C)" },
      readingTime: { $first: "$Time" },
    },
  };

  const sortStage = {
    $sort: {
      maxMeasurement: -1,
    },
  };

  const pipeline = [matchStage, groupStage, sortStage];

  const result = await db
    .collection("climate-data")
    .aggregate(pipeline)
    .toArray();

  return result.map((record) => ({
    deviceName: record._id,
    maxMeasurement: record.maxMeasurement,
    readingTime: record.readingTime,
  }));
}

// // GET MAX (value) RECORDED
// export async function getMaxReading(
//   measurement,
//   startDate,
//   endDate,
// ) {
//   const db = await getDb();

//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   end.setDate(end.getDate() + 1);

//   const query = {
//     // Time is indexed
//     Time: {
//       $gte: start,
//       $lt: end,
//     },
//   };

//   const sort = {};
//   sort[measurement] = -1;

//   const result = await db
//     .collection("climate-data")
//     // .find(query, { sort })
//     .find(query, { sort })
//     .toArray();
//   // const result = await db.collection("climate-data").findOne(query, { sort });

//   return { result };
// }

// GET ALL READINGS WITH PAGINATION
export async function getAllReadingsWithPagination(
  page = 1,
  limit = 10,
  sensor,
) {
  const db = await getDb();

  // Check if a sensor name has been provided
  const query = sensor ? { "Device Name": sensor } : {};

  // Count the number of results
  const totalResults = await db
    .collection("climate-data")
    .countDocuments(query);

  // Count the number of pages (10 results per page)
  const totalPages = Math.ceil(totalResults / limit);

  const readings = await db
    .collection("climate-data")
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    totalResults,
    currentPage: page,
    totalPages,
    readings,
  };
}
