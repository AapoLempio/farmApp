const cors = require("cors");
const express = require("express");
const path = require("path");
const { get } = require("express/lib/request");
const AWS = require("aws-sdk");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const docClient = new AWS.DynamoDB.DocumentClient();

//Endpoints to fetch data from frontend
app.get("/noorasFarmData", async (req, res) => {
  return res.send((await getFarmData("Nooras_farm")).Items);
});

app.get("/ossiFarmData", async (req, res) => {
  return res.send((await getFarmData("ossi_farm")).Items);
});

app.get("/partialFarmData", async (req, res) => {
  return res.send((await getFarmData("PartialTech")).Items);
});

app.get("/frimanFarmData", async (req, res) => {
  return res.send((await getFarmData("friman_metsola")).Items);
});

async function getFarmData(tableName) {
  const params = {
    TableName: tableName,
  };

  // Scan the database by table name
  const data = await docClient
    .scan(params, function (err, data) {
      if (err) {
        console.error("Unable to find farm data", err);
      } else {
        console.log(`Found ${data.Count} entries`);
        //console.log(data.Items);
      }
    })
    .promise();

  // If scan was successful, return the data to the endpoint
  try {
    console.log("Success");
    return await Promise.resolve(data);
  } catch (err) {
    console.log("Failure", err.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
