import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from "readline-sync";

import systemPrompt from "./systemPrompt.js";
import getWeather from "./weatherTool.js";
import {createUser, getAllUsers } from "./dbTools.js";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: systemPrompt,
  response_mime_type: "application/json",
});

const tools = {
  getWeather,
  createUser,
  getAllUsers
};

let messages = [];

async function main(){

  while (true) {
    messages = [];
    const input = readlineSync.question(">> ");
    const user = {
      type: "user",
      text: input,
    };
    messages.push(JSON.stringify(user));
    while (true) {
      const result_raw = await model.generateContent(JSON.stringify(messages));

      console.log(result_raw.response.text());
      const result = JSON.parse(result_raw.response.text());


      messages.push(result);

      if (result.type === "output") {
        console.log(result.output);
        break;
      }else if (result.type === "action") {
        const tool = tools[result.function];
        const output = await tool(result.input);
        const observation = {
          type: "observation",
          text: output,
        };
        console.log(observation)
        messages.push(observation);
      }
    }
  }

}

main();