// server/index.js

const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const path = require("path");

const PORT = process.env.PORT || 3001;

const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const docClient = new AWS.DynamoDB.DocumentClient();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/farmData", (req, res) => {
  return res.send('Object.values(');
});

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

async function getFarmData() {
  const params = {
    TableName: "farmData1",
  };

  return docClient
    .scan(params)
    .promise()
    .then((res) => {
      return res;
    });
}
