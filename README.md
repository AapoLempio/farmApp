# Solita dev academy 2022 -  Farm data exercise

This project was developed on a Windows 10 system. The instructions will be for Windows only.

# Project Setup

First thing to do is to intall Node.js from `https://nodejs.org/en/download/`. Node package manager will be installed with Node.js.

## DynamoDB
Install AWS command line interface from `https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html` for windows. Once installed, on a new powerShell window run `aws configure` command. It will ask for AWS Access Key ID. Put in for instance `FakeAccessKeyId`. Note, some value must be given. Because this is "dummy" dynamoDB database we will use these fake keys. Next it will ask for AWS Secret Access Key. Put in whatever, but some value must be given, again for instance `FakeSecretAccessKey`. Put `DefaultRegion` for instance to the next prompt and `Default` to the last.
Now we can start working on the dynamoDB.
DynamoDB can be setup by following the short instructions in the following link: `https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html`.
So once the .zip file has been downloaded it must be unzipped and then in powerShell in the DynamoDB's root directory that was unzipped, run `java -D"java.library.path=./DynamoDBLocal_lib" -jar DynamoDBLocal.jar` to start the local database.
To add the farmdata in to the database see the ingestCsv.js part at the bottom.

## Backend
To install dependencies for the server, run `npm install` from powerShell in the root of the project. To run the backend server run `npm start` from powerShell in the root directory of the project.

## Frontend
To install dependencies for the client, run `npm install` from powerShell in the `/client` directory of the project. Then run `npm start` to start the React frontend.
The frontend can be accessed in the browser through `http://localhost:3000`

If everything goes according to plan then the page should look like this:
![Should look like this](shouldLookLikethis.png?raw=true)

## Used technologies:

- DynamoDb local 
- Node backend
    - Aws-sdk
    - Express
    - Cors
    - papaparse
    - date-fns
- React frontend
    - Material ui

# The server
## deleteTables.js
All the tables and their data can be deleted by running `node deleteTables.js` in powerShell in the server folder.

## ingestCsv.js
To write the csv files' data to dynamodb, open powerShell on the server folder and run the `node ingestCsv.js` command. The `ingestCsv.js` script reads the csv files and batchWrites them in to the dynamoDb database.
That might take a some time even though the data is written in batches, but should be fairly quick. Couple of minutes at worst.
