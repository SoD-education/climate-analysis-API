// Climate data model constructor
export function Reading(
  id,
  deviceName,
  precipitation,
  time,
  lat,
  long,
  temp,
  atmosPressure,
  maxWind,
  solarRad,
  vaporPres,
  humidity,
  windDir
) {
  return {
    id,
    "Device Name": deviceName,
    "Precipitation mm/h": precipitation,
    Time: time,
    Latitude: lat,
    Longitude: long,
    "Temperature (°C)": temp,
    "Atmospheric Pressure (kPa)": atmosPressure,
    "Max Wind Speed (m/s)": maxWind,
    "Solar Radiation (W/m2)": solarRad,
    "Vapor Pressure (kPa)": vaporPres,
    "Humidity (%)": humidity,
    "Wind Direction (°)": windDir,
  };
}
