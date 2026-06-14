const fs = require('fs');
const readline = require('readline');

async function extractJson() {
  const fileStream = fs.createReadStream('C:\\Users\\NOM Studio\\.gemini\\antigravity\\brain\\a3769836-5ea8-4c23-8747-d574c4a881b7\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastUserMessage = '';
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.type === 'USER_INPUT') {
        lastUserMessage = step.content;
      }
    } catch (e) {}
  }

  // Find the JSON part in the last user message
  const jsonStartIndex = lastUserMessage.indexOf('{"v":"5.9.4"');
  if (jsonStartIndex !== -1) {
    let jsonStr = lastUserMessage.slice(jsonStartIndex);
    
    // Clean up if there's any trailing text after the JSON
    // The JSON should end with "}"
    const lastBraceIndex = jsonStr.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      jsonStr = jsonStr.slice(0, lastBraceIndex + 1);
    }
    
    fs.mkdirSync('h:\\NOM TECH FILES\\WEB DESIGNS\\2026\\NOMSTD\\nomstd-saas\\public\\assets\\lottie', { recursive: true });
    fs.writeFileSync('h:\\NOM TECH FILES\\WEB DESIGNS\\2026\\NOMSTD\\nomstd-saas\\public\\assets\\lottie\\mono-cat.json', jsonStr);
    console.log('Successfully extracted and saved Mono Cat Lottie JSON!');
  } else {
    console.log('Could not find JSON in the last user message.');
  }
}

extractJson();
