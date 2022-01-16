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

app.get("/farmData", async (req, res) => {
  return res.send((await getFarmData()).Items);
});

app.get("/farmData/byPH", async (req, res) => {
  return res.send(await getFarmDataByMetric("pH"));
});

app.get("/farmData/byRainFall", async (req, res) => {
  return res.send(await getFarmDataByMetric("rainFall"));
});

app.get("/farmData/byTemperature", async (req, res) => {
  return res.send(await getFarmDataByMetric("temperature"));
});

app.get("/farmData/byMonth", async (req, res) => {
  return res.send(await getFarmDataByDateProperty("month"));
});

async function getFarmData() {
  var params = {
    TableName: "Nooras_farm",
  };

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
  try {
    console.log("Success");
    return await Promise.resolve(data);
  } catch (err) {
    console.log("Failure", err.message);
  }
}

async function getFarmDataByMetric(metric = "") {
  return await getFarmData().then((data) => {
    return Promise.resolve(Object.values(data)[0].filter((item) => item.sensorType === metric));
  });
}

async function getFarmDataByDateProperty(indexValue = "") {
  return await getFarmData().then((data) => {
    return Promise.resolve(Object.values(data)[0].filter((item) => item.sensorType === index));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
