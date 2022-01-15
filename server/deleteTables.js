const fs = require("fs");

const path = require("path");

var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

var dynamodb = new AWS.DynamoDB();

const dir = "../farmData";

(async () => {
  // Our starting point
  try {
    console.log("Deleting tables from DynamoDB. Please wait.");
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
        deleteTable(String(file).split(".")[0]);
      } else if (stat.isDirectory())
        console.log("'%s' is a directory.", fullPath);
    }
  } catch (err) {
    // Catch anything bad that happens
    console.error("Error, can't delete tables:", err);
  }
})();

function deleteTable(tableName) {
  var params = {
    TableName: tableName,
  };
  dynamodb.deleteTable(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log(
        "Deleted table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
    }
  });
}
