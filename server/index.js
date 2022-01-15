const cors = require("cors");
const express = require("express");
const path = require("path");
const { get } = require("express/lib/request");
var AWS = require("aws-sdk");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const docClient = new AWS.DynamoDB.DocumentClient();

/* app.get("/farmData", (req, res) => {
  
  // return res.send(Object.values(getFarmData()));
}); */

app.get("/farmData", async (req, res) => {
  return res.send(await getFarmData());
});

async function getFarmData() {
  var params = {
    TableName: "farmData1",
  };

  const data = await docClient.scan(params, function (err, data) {
    if (err) {
      console.error("Unable to find farm data", err);
    } else {
      console.log(`Found ${data.Count} entries`);
      console.log(data.Items);
    }
  }).promise();
  try {
    console.log(await Promise.resolve(data));
    console.log("Success");
    return await Promise.resolve(data);
  } catch (err) {
    console.log("Failure", err.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
