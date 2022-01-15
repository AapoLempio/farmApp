const AWS = require("aws-sdk");

const fs = require("fs");

const Papa = require("papaparse");

var crypto = require("crypto");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const dynamodb = new AWS.DynamoDB();

const docClient = new AWS.DynamoDB.DocumentClient();

const path = require("path");

const dir = "../farmData";

// Make an async function that gets executed immediately
(async () => {
  // Our starting point
  try {
    console.log("Creating tables to DynamoDB. Please wait.");
    // Get the files as an array
    const files = await fs.promises.readdir(dir);

    // Loop them all with the new for...of
    for (const file of files) {
      // Get the full paths

      const fullPath = path.join(dir, file);

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fullPath);

      if (stat.isFile()) {
        console.log("'%s' is a file.", fullPath);
        createTable(String(file).split(".")[0], fullPath);
      } else if (stat.isDirectory())
        console.log("'%s' is a directory.", fullPath);
    }
  } catch (err) {
    // Catch anything bad that happens
    console.error("Error, can't read files:", err);
  }
})();

function createTable(tableName, filePath) {
  console.log("Creating table: " + tableName);

  var params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  dynamodb.createTable(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log(
        "Created table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
    }
  });

  console.log("Importing farm data into DynamoDB. Please wait.");

  const farmData = Papa.parse(fs.readFileSync(filePath, "utf8"), {
    header: true,
  });

  farmData.data.forEach(function (datapoint) {
    const params = {
      TableName: tableName,
      Item: {
        id: Number("0x" + String(crypto
          .createHash("md5")
          .update(String(datapoint.datetime + "_" + datapoint.sensorType))
          .digest("hex"))),
        location: datapoint.location,
        datetime: datapoint.datetime,
        sensorType: datapoint.sensorType,
        value: datapoint.value,
      },
    };

    docClient.put(params, function (err, data) {
      if (err) {
        console.log(datapoint);
        console.error(
          "Unable to add datapoint",
          datapoint,
          ". Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("PutItem succeeded:", datapoint);
      }
    });
  });
}
