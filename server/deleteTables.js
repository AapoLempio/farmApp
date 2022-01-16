const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000",
});

const dynamodb = new AWS.DynamoDB();

const dir = "../farmData";

// This function loops through the files in the farmData directory and
// deletes tables from the dynamoDB database based on the file names
// in the directory
(async () => {
  try {
    console.log("Deleting tables from DynamoDB. Please wait.");
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
      // Get the full paths
      const fullPath = path.join(dir, file);

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fullPath);

      // If is file then we try to delete a table by that files name
      if (stat.isFile()) {
        console.log("'%s' is a file.", fullPath);
        deleteTable(String(file).split(".")[0]);
      } else if (stat.isDirectory())
        console.log("'%s' is a directory.", fullPath);
    }
  } catch (err) {
    console.error("Error, can't delete tables:", err);
  }
})();

function deleteTable(tableName) {
  const params = {
    TableName: tableName,
  };

  //Delete the table from the dynamoDB database
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
