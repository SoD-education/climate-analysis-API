// Convert user-friendly sensor name to database format
export function convertSensorName(userFriendlyName) {
  if (userFriendlyName.endsWith("_Sensor")) {
    return userFriendlyName;
  } else {
    return `${
      userFriendlyName.charAt(0).toUpperCase() + userFriendlyName.slice(1)
    }_Sensor`;
  }
}
