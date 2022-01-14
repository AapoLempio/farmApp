const AWS = require("aws-sdk");

const fs = require("fs");

const Papa = require("papaparse");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const dynamodb = new AWS.DynamoDB();

const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Creating tables to DynamoDB. Please wait.");

var params = {
  TableName: "farmData1",
  KeySchema: [
    { AttributeName: "name", KeyType: "RANGE" },
    { AttributeName: "value", KeyType: "HASH" },
  ],
  AttributeDefinitions: [
    { AttributeName: "name", AttributeType: "S" },
    { AttributeName: "value", AttributeType: "N" },
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

const farmData = Papa.parse(
  fs.readFileSync("../farmData/testData.csv", "utf8"),
  { header: true }
);
console.log(farmData);
farmData.data.forEach(function (datapoint) {
  const params = {
    TableName: "farmData1",
    Item: {
      name: datapoint.name,
      value: parseInt(datapoint.value),
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.log(datapoint);
      console.error(
        "Unable to add datapoint",
        datapoint.name,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", datapoint.name);
    }
  });
});
