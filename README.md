# Solita dev academy 2022 -  Farm data exercise

This project was developed on a Windows 10 system. The instructions will be for Windows only.

## Project Setup

First thing to do is to intall Node.js from `https://nodejs.org/en/download/`. Node package manager will be installed with Node.js.

### DynamoDB
DynamoDB can be setup by following the short instructions in the following link: `https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html`.
So once the .zip file has been downloaded it must be unzipped and then in powerShell in the DynamoDB's root directory, run `java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar` to start the local database.
To add the farmdata in to the database see the ingestCsv.js in the Structure chapter below.

### Backend
To install dependencies for the server, run `npm install` from powerShell in the root of the project. To run the backend server run `npm start` from powerShel in the root directory of the project.

### Frontend
To install dependencies for the server, run `npm install` from powerShell in the `/client` directory of the project. Then run `npm start` to start the React frontend.
The frontend can be accessed in the browser through `http://localhost:3000`

### Used technologies:

- DynamoDb local 
- Node backend
    - Dependencies:
        - Aws-sdk
        - Express
        - Cors
        - papaparse
        - date-fns
- React frontend
    - Material ui
    - 

## Structure

### ingestCsv.js
To write the csv files' data to dynamodb from farmdata folder run `node server/ingestCsv.js` from the powerShell in the project root. The `ingestCsv.js` reads the csv files and batchWrites them in to the dynamoDb database.