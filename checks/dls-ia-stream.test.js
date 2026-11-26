const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../public/js/dls_source.js'), 'utf8');

function makeContext (chunks, contentType = 'text/event-stream; charset=UTF-8')
 { const messages = [];
   const proposals = [];
   const element = () => ({ textContent: '', remove () { this.removed = true; }, scrollIntoView () {}, append () {} });
   const jq = { prop () { return jq; }, html () { return jq; }, val () { return ''; }, removeClass () { return jq; }, addClass () { return jq; } };
   const context = {
     $: () => jq, $ABLS_API: 'https://api.test', Token: 'jwt', AbortController, TextDecoder, Uint8Array,
     setTimeout, clearTimeout, JSON,
     localStorage: { getItem: () => 'domain' },
     document: { getElementById: () => ({ placeholder: '' }) },
     fetch: async (url, options) =>
      { context.request = { url, options };
        const encoder = new TextEncoder();
        const body = new ReadableStream({ start (controller)
         { for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
           controller.close();
         } });
        return { status: 200, statusText: 'OK', headers: { get: () => contentType }, body,
                 text: async () => chunks.join('') };
      }
   };
   vm.runInNewContext(source, context);
   context.Dls = { tech_id: 'TEST' };
   context.SourceCode = { getDoc: () => ({ getValue: () => '/* src */' }) };
   context.Dls_IA_append_message = (role, text) => { const m = element(); m.textContent = text; messages.push({ role, m }); return m; };
   context.Dls_IA_add_proposal = (message, sourcecode) => proposals.push(sourcecode);
   return { context, messages, proposals };
 }

test('parses SSE events split across chunks and ignores ping comments', () =>
 { const { context } = makeContext([]);
   const parsed = context.Dls_IA_parse_sse(': ping\n\nevent: delta\ndata: {"content":"a"}\r\n\r\nevent: done\ndata: {"rep');
   assert.deepEqual(JSON.parse(JSON.stringify(parsed.events)), [{ event: 'delta', data: '{"content":"a"}' }]);
   assert.equal(parsed.rest, 'event: done\ndata: {"rep');
 });

test('streams deltas then applies the final reply and proposal', async () =>
 { const { context, messages, proposals } = makeContext([
     ': ping\n\nevent: delta\ndata: {"content":"Voi"}\n\nevent: del',
     'ta\ndata: {"content":"ci"}\n\n',
     'event: done\ndata: {"reply":"Voici.","sourcecode":"/* new */","api_status":200}\n\n' ]);
   await context.Dls_IA_send('fix', 'Corrige');
   await new Promise(resolve => setTimeout(resolve, 20));
   assert.equal(context.request.options.headers.Authorization, 'Bearer jwt');
   const assistant = messages.find(item => item.role === 'assistant');
   assert.equal(assistant.m.textContent, 'Voici.');
   assert.deepEqual(proposals, ['/* new */']);
   assert.equal(messages.some(item => item.role === 'error'), false);
   assert.equal(context.DlsIAHistory.length, 2);
   assert.equal(context.DlsIAAbort, null);
 });

test('shows SSE error event and JSON errors', async () =>
 { let run = makeContext(['event: error\ndata: {"api_status":502,"api_error":"IA provider timed out"}\n\n']);
   run.context.Dls_IA_send('chat', 'Q');
   await new Promise(resolve => setTimeout(resolve, 20));
   assert.equal(run.messages.at(-1).m.textContent, 'Erreur IA : IA provider timed out');
   run = makeContext(['{"api_error":"IA assistant is busy"}'], 'application/json');
   run.context.Dls_IA_send('chat', 'Q');
   await new Promise(resolve => setTimeout(resolve, 20));
   assert.equal(run.messages.at(-1).m.textContent, 'Erreur IA : IA assistant is busy');
   assert.equal(run.context.DlsIAHistory.length, 0);
 });
