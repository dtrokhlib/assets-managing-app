const fs = require("fs");
const path = require("path");
const { parse } = require('csv-parse');

const dataStore = [];

async function loadData() {
    await fs.createReadStream(path.join(__dirname, "..", "..", "data", "Sample.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        dataStore.push(data);
      })
      .on("error", (error) => {
        console.log(error);
        throw new Error("Was not able to read data!");
      })
      .on("end", async () => {
        console.log('Data read is finished!');
      });

    return dataStore;
}

module.exports = {
    loadData,
}