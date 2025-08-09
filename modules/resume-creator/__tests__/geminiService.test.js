// __tests__/geminiService.test.js
// Jest test for geminiService

require('dotenv').config();
const { callGemini } = require('../services/geminiService');

const TEST_PROMPT = 'Say hello world in different languages.';

describe('callGemini', () => {
  it('should return a non-empty string response from Gemini API', async () => {
    const result = await callGemini(TEST_PROMPT);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    // Optionally, check for a known phrase
    // expect(result.toLowerCase()).toContain('hello world');
  }, 20000); // Increase timeout for API call
});
