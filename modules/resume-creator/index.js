// server.js
// Express server to accept PDF URL and prompt, then generate a new PDF using Gemini

require('dotenv').config();
const express = require('express');
const { parsePdfFromUrl } = require('./services/pdfParserService');
const { markdownToPdf } = require('./services/markdownToPdfService');
const { callGemini } = require('./services/geminiService');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('./utils/uuid');

const app = express();
app.use(express.json({ limit: '5mb' }));

const RAW_PLACEHOLDER = process.env.RAW_PLACEHOLDER;
const PROMPT_PLACEHOLDER = process.env.PROMPT_PLACEHOLDER;
const NOTE = process.env.NOTE;

// POST /convert: Accepts pdfUrl and prompt, parses PDF, uses Gemini, returns new PDF
app.post('/convert', async (req, res) => {
  const { pdfUrl, prompt } = req.body;
  if (!pdfUrl || !prompt) {
    return res.status(400).json({ error: 'pdfUrl and prompt are required' });
  }
  const tempFilename = `output_${uuidv4()}.pdf`;
  const outputPath = path.join(__dirname, tempFilename);
  try {
    // 1. Parse PDF to text
    const pdfText = await parsePdfFromUrl(pdfUrl);
    // 2. Use Gemini service to generate new markdown from pdfText and prompt
    const geminiInput = NOTE.replace(RAW_PLACEHOLDER, pdfText).replace(PROMPT_PLACEHOLDER, prompt);
    console.log('Gemini input:', geminiInput);
    const newMarkdown = await callGemini(geminiInput);
    // 3. Convert new markdown to PDF
    await markdownToPdf(newMarkdown, outputPath);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="output.pdf"' });
    res.send(fs.readFileSync(outputPath));
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request', details: err.message });
    return;
  } finally {
    // Always clean up temp file
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
