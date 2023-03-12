#!/usr/bin/env node

import fs from "fs";
import inquirer from "inquirer";
import { execSync } from "child_process";

console.log("AWS SSO Login Selector");

const homeDir = process.env["HOME"];
const profileRegex = /\[profile .*]/g;
const bracketsRemovalRegx = /(\[profile )|(\])/g;
const defaultProfileChoice = "default";

const promptProfileChoice = (data) => {
  const matches = data.match(profileRegex);

  if (!matches) {
    console.log("No profiles found.");
    console.log(
      "Refer to this guide for help on setting up a new AWS profile:"
    );
    console.log(
      "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html"
    );

    return;
  }

  const profiles = matches.map((match) => {
    return match.replace(bracketsRemovalRegx, "");
  });

  profiles.push(defaultProfileChoice);

  const profileChoice = [
    {
      type: "list",
      name: "profile",
      message: "Choose a profile",
      choices: profiles,
      default: process.env.AWS_PROFILE || defaultProfileChoice,
    },
  ];

  return inquirer.prompt(profileChoice);
};

const readAwsProfiles = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${homeDir}/.aws/config`, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeToConfig = (answers) => {
  const profileChoice =
    answers.profile === defaultProfileChoice ? "" : answers.profile;

  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${homeDir}/.awssol`,
      profileChoice,
      { flag: "w" },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(profileChoice);
        }
      }
    );
  });
};

const callAwsSsoLogin = (profileName) => {
  try {
    const message = execSync(`aws sso login --profile ${profileName}`);
    console.log(message.toString());
  } catch (e) {
    console.error(e.toString());
  }
};

readAwsProfiles()
  .then(promptProfileChoice)
  .then(writeToConfig)
  .then(callAwsSsoLogin)
  .catch((error) => {
    console.log("Error:", error);
    process.exit(1);
  });
