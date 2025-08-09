// services/geminiService.js
// Service to interact with Gemini API using @google/genai

const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

/**
 * Calls Gemini API with the given input and returns the streamed result as a string.
 * @param {string} input - The prompt or input for Gemini.
 * @returns {Promise<string>} - The streamed response from Gemini.
 */
async function callGemini(input) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const tools = [
    { googleSearch: {} },
  ];
  const config = {
    thinkingConfig: { thinkingBudget: -1 },
    tools,
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [{ text: input }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let result = '';
  for await (const chunk of response) {
    if (chunk.text) result += chunk.text;
  }
  return result;
}

module.exports = { callGemini };
