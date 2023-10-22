export function convertMeasurementName(measurement) {
  const mapping = {
    temp: "Temperature (°C)",
    temperature: "Temperature (°C)",
    humidity: "Humidity (%)",
    precip: "Precipitation mm/h",
    precipitation: "Precipitation mm/h",
    solar: "Solar Radiation (W/m2)",
    radiation: "Solar Radiation (W/m2)",
    wind: "Max Wind Speed (m/s)",
    "wind speed": "Max Wind Speed (m/s)",
    pressure: "Atmospheric Pressure (kPa)",
    vapor: "Vapor Pressure (kPa)",
    direction: "Wind Direction (°)",
    "wind direction": "Wind Direction (°)",
  };

  const dbField = mapping[measurement.toLowerCase()];
  if (!dbField) {
    throw new Error("Invalid measurement type.");
  }

  return dbField;
}
