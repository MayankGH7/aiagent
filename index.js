import { GoogleGenerativeAI } from "@google/generative-ai";
import systemPrompt from "./systemPrompt.js";
import getWeather from "./weatherTool.js";
import readlineSync from "readline-sync";

const genAI = new GoogleGenerativeAI("AIzaSyDFAjL-aeelo-vOuNFZEAZaepZGMIlZRD0");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: systemPrompt,
  response_mime_type: "application/json",
});

const tools = {
  getWeather,
};

let messages = [];

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
    const result = JSON.parse(result_raw.response.text());

    messages.push(result);

    if (result.type === "output") {
      console.log(result.output);
      break;
    }else if (result.type === "action") {
      const tool = tools[result.function];
      const output = tool(result.input);
      const observation = {
        type: "observation",
        text: output,
      };
      messages.push(observation);
    }
  }
}