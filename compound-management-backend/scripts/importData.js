const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const db = require("../models");
const Compound = db.Compound;

const csvFilePath = path.join(__dirname, "../data/compound.csv");

const importData = () => {
  const compounds = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: "," })) // Use comma as separator
    .on("data", (row) => {
      // Validate fields before pushing
      if (row.CompoundName && row.strImageSource && row.CompounrDescription) {
        compounds.push({
          name: row.CompoundName,
          image: row.strImageSource,
          description: row.CompounrDescription, // Match the CSV field name (CompounrDescription)
        });
      } else {
        console.warn("Skipping row due to missing data:", row);
      }
    })
    .on("end", async () => {
      try {
        await Compound.bulkCreate(compounds);
        console.log(`${compounds.length} compounds imported successfully!`);
        process.exit(0);
      } catch (error) {
        console.error("Error importing data:", error);
        process.exit(1);
      }
    })
    .on("error", (error) => {
      console.error("CSV processing error:", error);
      process.exit(1);
    });
};

// Initialize database connection and import data
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced");
    importData();
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });