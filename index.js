import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import readline from "readline";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Path to the input and output files
const inputFile = "data/review100B.json";
const outputFile = "data/newData.json";

// Create a read stream and a write stream
const input = fs.createReadStream(inputFile, "utf8");
const output = fs.createWriteStream(outputFile);

// Use readline to read the input file line by line
const rl = readline.createInterface({
  input,
  crlfDelay: Infinity,
});

// Flag to track if this is the first object
let isFirstObject = true;

// Start writing the array into the output file
output.write("["); // Start the array

// Read each line of the file
rl.on("line", (line) => {
  const trimmedLine = line.trim();

  if (trimmedLine) {
    // If it's not the first object, add a comma before the next object
    if (!isFirstObject) {
      output.write(",");
    }

    // Write the current JSON line to the output
    output.write(trimmedLine);
    isFirstObject = false;
  }
});

// When the file reading is complete
rl.on("close", () => {
  output.write("]"); // End the array
  console.log(
    `The JSON data has been successfully fixed and saved to ${outputFile}`
  );

  // End the output stream and close it
  output.end();
});

// Handle errors during reading
rl.on("error", (err) => {
  console.error("Error while reading the file:", err);
});

// Handle errors during writing
output.on("error", (err) => {
  console.error("Error while writing the file:", err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
