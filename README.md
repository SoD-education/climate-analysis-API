# RESTful API for Climate Data Analysis

Welcome to the README for the RESTful API project developed for our client, an educational institution. This API is designed to interact with a MongoDB database containing a large dataset of raw climate data. The client's goal is to use this data for student projects that analyze climate data collected in Queensland (QLD) using an Internet of Things (IoT) Sensor network.

## Project Overview

### Objective

The main objectives of this project include:

1. Developing a MongoDB REST API to interact with raw climate data.
2. Implementing a RESTful Web API to facilitate data access and manipulation.
3. Incorporating authentication and authorization mechanisms for secure access control.
4. Storing weather data and user information in MongoDB collections.

## Raw Data Access

The project utilizes raw climate data accessible at `/data/climate-data.json`.  
Additionally, dummy user data can be found at `/data/users.json`.

## MongoDB Schema

To meet the project's business requirements, we have structured the raw data into a suitable MongoDB schema. This schema includes the necessary documents and collections. It's essential to note that not all raw data may be required for the project, and data should only be discarded after careful consideration of the project requirements.

## MongoDB Data Storage, Partition, and Scalability

Efficiency in storage and retrieval across the distributed horizontal setup is crucial. To achieve this, we have:

1. Selected an appropriate data field for effective data partitioning.
2. Implemented indexing based on the resulting schema to optimize data retrieval.
3. Implemented Time-to-Live (TTL) for automatic document removal if a user has not logged in for 30 days.
4. Created triggers to remove documents with invalid weather readings and to update location values when latitude and longitude are updated.

## MongoDB and API Security

Security is a top priority for our client. Therefore, we have ensured the following security measures:

1. Encryption in transit: Data is encrypted when sent across the network.
2. Encryption at rest: Data is encrypted when stored on the database server.
3. Individual user accounts: User accounts are created to control authentication and access to specific endpoints.
4. Secure connection: The connection between the web API and the database is secure to prevent unauthorized access or modifications.
5. Database user account: A user account with appropriate authorization is created on the database server to manage access between the API and the database.
6. Multiple user accounts: Various user accounts are created to control the actions each user is authorized to perform.

## RESTful API MongoDB Interactions and Operations

The API supports various interactions and operations, including:

1. Inserting a new weather reading for a weather station.
2. Inserting a new user account.
3. Inserting multiple sensor readings for a single station.
4. Finding the maximum precipitation recorded in the last 5 months for a specific sensor.
5. Retrieving data for temperature, atmospheric pressure, radiation, and precipitation by station and date/time.
6. Finding the maximum temperature recorded for all stations within a specified date/time range.
7. Efficient querying using index keys.
8. Deleting a user by ID.
9. Deleting multiple users who have not logged in for more than 30 days.
10. Updating a specific entry's precipitation value.
11. Updating access levels for multiple users based on their creation date range.

## Usage

For instructions on how to use the API and details on endpoints, please refer to the API documentation provided separately.
