const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('displays and refreshes separate Whisper and Ollama URLs from status', () =>
 { const html = fs.readFileSync(path.join(__dirname, '../public/views/api_status.html'), 'utf8');
   const source = fs.readFileSync(path.join(__dirname, '../public/js/api_status.js'), 'utf8');
   const values = new Map();
   const context = {
     $ (selector)
      { assert.ok(html.includes(`id="${selector.slice(1)}"`), `Missing status element: ${selector}`);
        const element = {
          val (value) { values.set(selector, value); return element; },
          attr () { return element; },
          text () { return element; },
          removeClass () { return element; },
          addClass () { return element; },
          css () { return element; }
        };
        return element;
      }
   };
   vm.runInNewContext(source, context);
   const aiCard = html.split('<div class="card-header">')
                      .find(section => section.includes('<label>Intelligence artificielle</label>'));
   assert.ok(aiCard, 'Missing AI status card');
   assert.match(aiCard, /<label\b[^>]*for="idApiStatusWhisperUrl"[^>]*>Reconnaissance vocale Whisper<\/label>[\s\S]*?<input\b[^>]*id="idApiStatusWhisperUrl"/);
   assert.match(aiCard, /<label\b[^>]*for="idApiStatusOllamaUrl"[^>]*>URL Ollama<\/label>[\s\S]*?<input\b[^>]*id="idApiStatusOllamaUrl"/);
   for (const host of ['localhost', 'ai.example.test'])
    { const response = {
        whisper_url: `http://${host}:5561/inference`,
        ollama_url: `http://${host}:11434/v1/chat/completions`,
        master_cache_hit_ratio: 0
      };
      context.API_Status_Display(response);
      assert.equal(values.get('#idApiStatusWhisperUrl'), response.whisper_url);
      assert.equal(values.get('#idApiStatusOllamaUrl'), response.ollama_url);
    }
 });
