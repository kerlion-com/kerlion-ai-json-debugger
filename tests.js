"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const app=fs.readFileSync("app.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("styles.css","utf8");

for(const token of ["function extractJson","function errorPosition","function validateValue","function runBatch","function escapeHtml","function copyJson","function downloadJson","function invalidateSchemaResults"]) {
  assert.ok(app.includes(token),"Missing implementation: "+token);
}
for(const id of ["inputText","extractToggle","analyzeButton","diagnosisContent","jsonOutput","schemaText","validateSchemaButton","batchList","runBatchButton","languageButton","themeButton"]) {
  assert.ok(html.includes('id="'+id+'"'),"Missing UI control: "+id);
}
assert.ok(!app.includes("eval("),"eval must not be used");
assert.ok(!app.includes("new Function("),"dynamic Function constructor must not be used");
assert.ok(html.includes('rel="noopener noreferrer"'),"External links must be isolated");
assert.ok(html.includes("ajv-dist@8.17.1/ajv7.min.js"),"Ajv browser bundle URL must point to ajv-dist");
assert.ok(app.includes("window.ajv7"),"Ajv browser global must be referenced");
assert.ok(css.includes("@media(max-width:760px)"),"Responsive mobile layout is required");
assert.ok(css.includes("[dir=\\"rtl\\"]"),"RTL layout is required");
assert.ok(app.includes("state.batch=[];renderBatch();"),"Clear action must clear batch samples");
assert.ok(app.includes('addEventListener("input",invalidateSchemaResults)'),"Schema edits must invalidate old results");

// Run the pure parser helpers in a lightweight VM without needing a browser.
const executable=app.slice(0,app.indexOf('$("#inputText").addEventListener'));
const sandbox={document:{querySelector(){return null;}},window:{},localStorage:{getItem(){return null;},setItem(){}},URLSearchParams,location:{search:""},console,setTimeout,clearTimeout};
vm.runInNewContext(executable,sandbox);
const extract=vm.runInNewContext("extractJson",sandbox);
const parse=vm.runInNewContext("parseJson",sandbox);

const fenced=extract("Result:\\n```json\\n{\\n  \\"ok\\": true\\n}\\n```");
assert.equal(fenced.found,true);
assert.deepEqual(JSON.parse(JSON.stringify(fenced.value)),{ok:true});
assert.equal(extract("prefix [1,2,3] suffix").found,true);
assert.equal(extract('{"x": [1, 2]}').found,true);
assert.equal(extract("nothing here").found,false);
assert.equal(parse('{"x":1,}').ok,false);
assert.equal(parse('{"x":[1,2]}').ok,true);
const location=parse('{"first":1,\\n"second": }').location;
assert.ok(location.line>=1);
assert.ok(location.column>=1);
assert.equal(typeof location.approximate,"boolean");
console.log("KERLION AI JSON Debugger parser and static tests passed.");
