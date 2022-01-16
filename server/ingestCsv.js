const AWS = require("aws-sdk");

const fs = require("fs");

const Papa = require("papaparse");

const crypto = require("crypto");

const { format } = require("date-fns");

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
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
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
      console.log(`Created ${tableName} table`);
    }
  });

  //Wait some time to finish creating table

  setTimeout(() => {
    console.log(
      `Importing ${tableName} data into DynamoDB. This might take a couple of minutes. Please wait.`
    );

    const farmData = Papa.parse(fs.readFileSync(filePath, "utf8"), {
      header: true,
    });
    const dataItems = farmData.data
      .map((datapoint) => (isValid(datapoint) ? datapoint : null))
      .filter(Boolean);

    const dataChunks = chunkArray(dataItems, 25);

    dataChunks.forEach((dataChunk) => putItems(tableName, dataChunk));
  }, 5000);
}

function putItems(tableName, datapoints) {
  const items = [];
  datapoints.forEach(function (datapoint) {
    const params = {
      PutRequest: {
        Item: {
          id: Number(
            "0x" +
              String(
                crypto
                  .createHash("md5")
                  .update(
                    String(datapoint.datetime + "_" + datapoint.sensorType)
                  )
                  .digest("hex")
              )
          ),
          location: datapoint.location,
          datetime: format(
            new Date(Date.parse(datapoint.datetime)),
            "yyyy/MM/dd kk:mm:ss"
          ).toString(),
          sensorType: datapoint.sensorType,
          value: datapoint.value,
        },
      },
    };
    items.push(params);
  });

  var params = {
    RequestItems: {},
  };
  params.RequestItems[tableName] = items;

  docClient.batchWrite(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add batch",
        datapoints,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    }
  });
}

function chunkArray(array, chunk_size) {
  var results = [];

  while (array.length) {
    results.push(array.splice(0, chunk_size));
  }

  return results;
}

function isValid(datapoint) {
  const value = parseFloat(datapoint.value);
  return datapoint.location != "" &&
    Date.parse(datapoint.datetime) != NaN &&
    ((datapoint.sensorType == "pH" && value >= 0 && value <= 14) ||
      (datapoint.sensorType == "temperature" && value >= -50 && value <= 100) ||
      (datapoint.sensorType == "rainFall" && value >= 0 && value <= 500))
    ? true
    : false;
}
