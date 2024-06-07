import * as core from "@actions/core";

import * as fs from "fs";
import Ajv from "ajv"
const ajv = new Ajv({allErrors: true})


/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const schemaUrl = core.getInput("schema-url");
    const targetDir = core.getInput("target-dir");

    const targetDirs = targetDir.split(",");

    let schema: string;
    try {
      schema = await (await fetch(schemaUrl)).text();
    } catch(e) {
      console.error("Error fetching schema: ", e);
      throw e;
    }
    console.log("Validating against schema found at", schemaUrl);
    const validate = ajv.compile(JSON.parse(schema));
      for (const targetDir of targetDirs) {
        const files = fs.readdirSync(targetDir);
        for (const file of files) {
          const content = fs.readFileSync(`${targetDir}/${file}`, "utf-8");
          const valid = validate(JSON.parse(content));
          if (!valid) {
            throw "Invalid schema: " + JSON.stringify(validate.errors);
          }
        }
      }

    const time = new Date().toTimeString();
    core.setOutput("time", time);
  } catch (error: any) {
    // Handle errors and indicate failure
    core.setFailed(error.message);
  }
}
