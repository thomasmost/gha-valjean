import * as core from "@actions/core";

import * as fs from "fs";
import Ajv2019 from "ajv"
import Ajv2020 from 'ajv/dist/2020'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Fetch the value of the input 'who-to-greet' specified in action.yml
    const schemaUrl = core.getInput("schema-url");
    const targetDir = core.getInput("target-dir");
    const allErrors = core.getInput("all-errors") === "true";
    const strict = core.getInput("ajv-strict") === "true";
    const draftVersion = core.getInput("draft-version");

    const ajv = draftVersion === "2020" ? new Ajv2020({allErrors, strict}) : new Ajv2019({allErrors, strict});

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
          process.stdout.write(`Validating ${targetDir}/${file}...`);
          const valid = validate(JSON.parse(content));
          if (!valid) {
            process.stdout.write("\n");
            console.error(`Validation failed for ${targetDir}/${file} due to errors: ${JSON.stringify(validate.errors)}`);
            throw "Invalid schema: " + JSON.stringify(validate.errors);
          } else {
            process.stdout.write("\x1b[34mVALID\x1b[89m");
            process.stdout.write("\x1b[0m")
            process.stdout.write("\n");
          }
        }
      }

    const time = new Date().toTimeString();
    process.stdout.write("\n\x1b[34mValidation Completed!\x1b[89m");
    core.setOutput("time", time);
  } catch (error: any) {
    console.error(`Action failed due to errors: ${JSON.stringify(error)}`);
    // Handle errors and indicate failure
    core.setFailed(error.message);
  }
}
