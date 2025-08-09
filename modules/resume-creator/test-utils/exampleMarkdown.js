// test-utils/exampleMarkdown.js
// Example markdown content for testing markdownToPdfService

const fs = require('fs');
const path = require('path');

const exampleMarkdown = fs.readFileSync(path.join(__dirname, '../assets/example.md'), 'utf-8');

module.exports = { exampleMarkdown };
