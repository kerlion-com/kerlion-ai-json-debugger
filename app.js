(() => {
"use strict";
const $ = (s) => document.querySelector(s);
const state = { value:null, parsed:false, batch:[], lang:"en", theme:"dark" };
const samples = {
 response: 'Here is the structured result:\n\n\`\`\`json\n{\n  "id": 42,\n  "name": "KERLION",\n  "active": true,\n  "tags": ["AI", "JSON"]\n}\n\`\`\`\n\nLet me know if you need anything else.',
 schema: JSON.stringify({type:"object",required:["id","name","active"],additionalProperties:false,properties:{id:{type:"integer"},name:{type:"string",minLength:1},active:{type:"boolean"},tags:{type:"array",items:{type:"string"}}}},null,2)
};
const words = {
 en:{local:"Runs locally in your browser",eyebrow:"AI OUTPUT WORKSPACE",title:"AI JSON Debugger",subtitle:"Inspect, extract, and validate structured output from AI models — without sending your data anywhere.",inputTitle:"AI response",inputHint:"Paste the complete response from your AI model.",sample:"Load sample",clear:"Clear",extract:"Extract JSON from surrounding text and Markdown fences",analyze:"Analyze output",diagnosis:"Diagnosis",diagnosisHint:"Syntax check and actionable error details.",waiting:"Waiting",emptyDiagnosis:"Analyze an AI response to see its diagnosis here.",structured:"Structured JSON",structuredHint:"Review the extracted, formatted result.",copy:"Copy",download:"Download",jsonPlaceholder:"Formatted JSON will appear here.",schemaTitle:"JSON Schema validation",schemaHint:"Check whether the AI output matches your expected structure.",schemaSample:"Load schema example",schemaIdle:"Add a schema to validate the parsed JSON.",validate:"Validate against schema",batchTitle:"Batch output checks",batchHint:"Test multiple AI responses against the same schema.",addSample:"Add sample",batchEmpty:"Add samples to run a consistency check.",batchIdle:"No samples added",runBatch:"Run batch checks",noteTitle:"Important",noteText:"This tool diagnoses JSON syntax and validates structure. It does not judge whether AI-generated values are factually correct or safe for your application.",footer:"Built for developers working with AI-generated structured data.",characters:"characters",valid:"Valid JSON",invalid:"Invalid JSON",noObject:"No JSON object or array could be extracted.",parseSuccess:"The JSON parsed successfully.",extracted:"JSON extracted from surrounding text.",plain:"The complete response is valid JSON.",syntax:"JSON syntax error",line:"Line",column:"Column",detail:"Parser message",unexpectedEnd:"The input may be incomplete or missing a closing bracket, quote, or value.",copySuccess:"JSON copied.",copyFail:"Could not copy automatically.",downloadSuccess:"Download prepared.",loadNotice:"Sample loaded.",clearNotice:"Input cleared.",noInput:"Paste an AI response first.",schemaSyntax:"Schema JSON syntax error",schemaInvalid:"The schema itself is invalid.",schemaValid:"Schema validation passed.",schemaFailed:"Schema validation failed.",schemaNeeded:"Add a valid JSON Schema first.",ajvMissing:"Schema validator did not load. Check your connection and refresh the page.",schemaSyntaxHint:"Correct the schema JSON before validating.",noStructured:"Analyze a valid JSON response before schema validation.",noSamples:"Add at least one sample.",batchPassed:"Passed",batchFailed:"Failed",sampleName:"Sample",remove:"Remove",batchDone:"Batch complete",notObject:"Root value is not an object or array.",parseDetail:"Parser message",lineCol:"Line {line}, column {column}"},
 ar:{local:"تتم المعالجة محليًا في المتصفح",eyebrow:"مساحة عمل لمخرجات الذكاء الاصطناعي",title:"مصحح JSON لمخرجات AI",subtitle:"افحص واستخرج وتحقق من البيانات المنظمة التي تنتجها نماذج الذكاء الاصطناعي، دون إرسال بياناتك إلى أي خادم.",inputTitle:"استجابة الذكاء الاصطناعي",inputHint:"الصق الاستجابة كاملة كما أعادها نموذج الذكاء الاصطناعي.",sample:"تحميل مثال",clear:"مسح",extract:"استخراج JSON من النص المحيط وأسوار Markdown",analyze:"تحليل المخرجات",diagnosis:"التشخيص",diagnosisHint:"فحص الصياغة وتحديد تفاصيل الأخطاء.",waiting:"في الانتظار",emptyDiagnosis:"حلل استجابة AI لعرض نتيجة التشخيص هنا.",structured:"بيانات JSON المنظمة",structuredHint:"راجع النتيجة المستخرجة والمنسقة.",copy:"نسخ",download:"تنزيل",jsonPlaceholder:"ستظهر بيانات JSON المنسقة هنا.",schemaTitle:"التحقق باستخدام JSON Schema",schemaHint:"تحقق من مطابقة مخرجات AI للبنية المتوقعة.",schemaSample:"تحميل مثال للمخطط",schemaIdle:"أضف مخططًا للتحقق من بيانات JSON.",validate:"التحقق من المخطط",batchTitle:"فحص عدة مخرجات",batchHint:"اختبر عدة استجابات من AI باستخدام المخطط نفسه.",addSample:"إضافة عينة",batchEmpty:"أضف عينات لإجراء فحص الاتساق.",batchIdle:"لم تتم إضافة عينات",runBatch:"فحص العينات",noteTitle:"ملاحظة مهمة",noteText:"تفحص الأداة صياغة JSON وتتحقق من بنيته فقط. لا تحكم على صحة القيم التي أنتجها الذكاء الاصطناعي أو مدى أمان استخدامها في تطبيقك.",footer:"أداة للمطورين الذين يتعاملون مع البيانات المنظمة الناتجة عن الذكاء الاصطناعي.",characters:"حرف",valid:"JSON صالح",invalid:"JSON غير صالح",noObject:"تعذر استخراج كائن JSON أو مصفوفة.",parseSuccess:"تم تحليل JSON بنجاح.",extracted:"تم استخراج JSON من النص المحيط.",plain:"الاستجابة كاملة عبارة عن JSON صالح.",syntax:"خطأ في صياغة JSON",line:"السطر",column:"العمود",detail:"رسالة المحلل",unexpectedEnd:"قد يكون الإدخال غير مكتمل أو يفتقد قوس إغلاق أو علامة اقتباس أو قيمة.",copySuccess:"تم نسخ JSON.",copyFail:"تعذر النسخ تلقائيًا.",downloadSuccess:"الملف جاهز للتنزيل.",loadNotice:"تم تحميل المثال.",clearNotice:"تم مسح الإدخال.",noInput:"الصق استجابة AI أولًا.",schemaSyntax:"خطأ في صياغة JSON الخاص بالمخطط",schemaInvalid:"المخطط نفسه غير صالح.",schemaValid:"نجح التحقق من المخطط.",schemaFailed:"فشل التحقق من المخطط.",schemaNeeded:"أضف JSON Schema صالحًا أولًا.",ajvMissing:"تعذر تحميل مكتبة التحقق من المخطط. تحقق من الاتصال ثم أعد تحميل الصفحة.",schemaSyntaxHint:"صحح صياغة المخطط قبل التحقق.",noStructured:"حلل استجابة JSON صالحة قبل التحقق من المخطط.",noSamples:"أضف عينة واحدة على الأقل.",batchPassed:"ناجحة",batchFailed:"فاشلة",sampleName:"العينة",remove:"حذف",batchDone:"اكتمل الفحص",notObject:"القيمة الأساسية ليست كائنًا أو مصفوفة.",parseDetail:"رسالة المحلل",lineCol:"السطر {line}، العمود {column}"}};
const t=(key)=>words[state.lang][key]||key;
function notify(text){const el=$("#toast");el.textContent=text;el.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove("show"),2300);}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function errorPosition(error,source){
 const message=String(error&&error.message||"Invalid JSON");
 const match=message.match(/(?:position|at position)\\s+(\\d+)/i);
 if(match){
  const position=Math.max(0,Math.min(Number(match[1]),source.length));
  const before=source.slice(0,position);
  return {message,position,line:before.split("\\n").length,column:position-before.lastIndexOf("\\n"),approximate:false};
 }
 // Native JSON.parse messages differ by browser. Provide a best-effort
 // approximate location when the parser does not expose a numeric offset.
 let stack=[],quoted=false,escaped=false,position=null,lastNonWhitespace=-1;
 for(let i=0;i<source.length;i++){
  const c=source[i];
  if(quoted){if(escaped)escaped=false;else if(c==="\\\\")escaped=true;else if(c==='"')quoted=false;continue;}
  if(c==='"'){quoted=true;lastNonWhitespace=i;continue;}
  if(c==="{"||c==="["){stack.push(c);lastNonWhitespace=i;continue;}
  if(c==="}"||c==="]"){
   const top=stack[stack.length-1];
   if(!top||((c==="}")!==(top==="{"))){position=i;break;}
   stack.pop();lastNonWhitespace=i;continue;
  }
  if(!/\\s/.test(c))lastNonWhitespace=i;
 }
 if(position===null)position=(quoted||stack.length)?source.length:Math.min(source.length,lastNonWhitespace+1);
 const before=source.slice(0,position);
 return {message,position,line:before.split("\\n").length,column:position-before.lastIndexOf("\\n"),approximate:true};
}
function clearSchemaResults(){
 $("#schemaResults").replaceChildren();
 $("#schemaStatus").textContent=t("schemaIdle");
}
function invalidateSchemaResults(){
 clearSchemaResults();
 state.batch.forEach(item=>item.result=null);
 if(state.batch.length)renderBatch();
}
function parseJson(text){try{return {ok:true,value:JSON.parse(text)};}catch(error){return {ok:false,error,location:errorPosition(error,text)};}}
function extractJson(source){
 const input=source.trim();if(!input)return {found:false,empty:true};
 const full=parseJson(input);if(full.ok)return {found:true,value:full.value,text:input,extracted:false};
 const candidates=[];
 const fence=/\`\`\`(?:json|javascript|js)?\s*([\s\S]*?)\`\`\`/gi;let match;
 while((match=fence.exec(input))!==null)candidates.push(match[1].trim());
 if(!candidates.length){
  for(let start=0;start<input.length;start++){
   const open=input[start];if(open!=="{"&&open!=="[")continue;
   const stack=[];let quoted=false,escaped=false;
   for(let i=start;i<input.length;i++){
    const c=input[i];
    if(quoted){if(escaped)escaped=false;else if(c==="\\")escaped=true;else if(c==='"')quoted=false;continue;}
    if(c==='"'){quoted=true;continue;}
    if(c==="{"||c==="[")stack.push(c);
    else if(c==="}"||c==="]"){
     const expected=c==="}"?"{":"[";
     if(stack.pop()!==expected)break;
     if(stack.length===0){candidates.push(input.slice(start,i+1));break;}
    }
   }
  }
 }
 for(const candidate of candidates){const parsed=parseJson(candidate);if(parsed.ok)return {found:true,value:parsed.value,text:candidate,extracted:true};}
 return {found:false,error:full.error,location:full.location};
}
function badge(kind,label){const el=$("#parseBadge");el.className="status-badge "+kind;el.textContent=label;}
function diagnose(result){
 const target=$("#diagnosisContent");
 if(!result.found){
  badge("bad",t("invalid"));
  const where=result.location&&result.location.line?t("lineCol").replace("{line}",result.location.line).replace("{column}",result.location.column):t("unexpectedEnd");
  target.innerHTML='<div class="diagnosis-card error"><strong>'+escapeHtml(t("syntax"))+'</strong><p>'+escapeHtml(where)+'</p><p>'+escapeHtml(result.location?result.location.message:t("noObject"))+'</p></div>';
  return;
 }
 badge("good",t("valid"));
 const root=Array.isArray(result.value)?"Array":result.value===null?"null":typeof result.value;
 target.innerHTML='<div class="diagnosis-card success"><strong>'+escapeHtml(t("parseSuccess"))+'</strong><p>'+escapeHtml(result.extracted?t("extracted"):t("plain"))+'</p></div><div class="diagnosis-card"><strong>Root type</strong><p>'+escapeHtml(root)+'</p></div>';
 if(result.value===null||typeof result.value!=="object")target.innerHTML+='<div class="diagnosis-card"><strong>'+escapeHtml(t("notObject"))+'</strong></div>';
}
function analyze(){
 const source=$("#inputText").value;
 clearSchemaResults();
 state.batch.forEach(item=>item.result=null);
 if(state.batch.length)renderBatch();
 if(!source.trim()){state.parsed=false;state.value=null;notify(t("noInput"));return;}
 const result=$("#extractToggle").checked?extractJson(source):(()=>{const p=parseJson(source.trim());return p.ok?{found:true,value:p.value,extracted:false}: {found:false,location:p.location};})();
 state.parsed=result.found;state.value=result.found?result.value:null;
 if(result.found){$("#jsonOutput").textContent=JSON.stringify(result.value,null,2);$("#copyJsonButton").disabled=false;$("#downloadJsonButton").disabled=false;$("#validateSchemaButton").disabled=false;}
 else{$("#jsonOutput").textContent=t("jsonPlaceholder");$("#copyJsonButton").disabled=true;$("#downloadJsonButton").disabled=true;$("#validateSchemaButton").disabled=true;}
 diagnose(result);
}
function ajvInstance(){if(!window.ajv7)return null;const Ajv=window.ajv7.default||window.ajv7;try{return new Ajv({allErrors:true,strict:false,allowUnionTypes:true});}catch(_){return null;}}
function validateValue(schemaText,data){
 const parsed=parseJson(schemaText);if(!parsed.ok)return {schemaSyntax:true,location:parsed.location};
 const ajv=ajvInstance();if(!ajv)return {unavailable:true};
 try{const validate=ajv.compile(parsed.value);return {valid:!!validate(data),errors:validate.errors||[]};}
 catch(error){return {schemaInvalid:true,message:error.message};}
}
function renderSchema(result){
 const output=$("#schemaResults");output.replaceChildren();
 const add=(className,title,detail)=>{const box=document.createElement("div");box.className=className;const strong=document.createElement("strong");strong.textContent=title;box.append(strong);if(detail){const p=document.createElement("p");p.textContent=detail;box.append(p);}output.append(box);};
 if(result.unavailable){add("schema-issue",t("ajvMissing"));return;}
 if(result.schemaSyntax){add("schema-issue",t("schemaSyntax"),result.location.message);return;}
 if(result.schemaInvalid){add("schema-issue",t("schemaInvalid"),result.message);return;}
 if(result.valid){add("diagnosis-card success",t("schemaValid"));return;}
 add("diagnosis-card error",t("schemaFailed"));
 (result.errors||[]).forEach(err=>add("schema-issue",err.instancePath||"/",err.message||"Invalid value"));
}
function validateCurrent(){
 if(!state.parsed){notify(t("noStructured"));return;}
 const schema=$("#schemaText").value.trim();if(!schema){notify(t("schemaNeeded"));return;}
 const result=validateValue(schema,state.value);renderSchema(result);
 $("#schemaStatus").textContent=result.valid?t("schemaValid"):result.unavailable?t("ajvMissing"):result.schemaSyntax?t("schemaSyntaxHint"):t("schemaFailed");
}
function addBatch(value=""){state.batch.push({id:Math.random().toString(36).slice(2),value,result:null});renderBatch();}
function renderBatch(summary){
 const list=$("#batchList");
 if(!state.batch.length){list.innerHTML='<div class="batch-empty">'+escapeHtml(t("batchEmpty"))+'</div>';$("#runBatchButton").disabled=true;$("#batchSummary").textContent=t("batchIdle");return;}
 list.replaceChildren();
 state.batch.forEach((item,index)=>{
  const row=document.createElement("div");row.className="batch-item";row.dataset.id=item.id;
  const left=document.createElement("div");const label=document.createElement("div");label.className="batch-label";label.textContent=t("sampleName")+" "+(index+1);
  const textarea=document.createElement("textarea");textarea.className="batch-text";textarea.setAttribute("aria-label","Batch sample "+(index+1));textarea.spellcheck=false;textarea.value=item.value;left.append(label,textarea);
  const right=document.createElement("div");const status=document.createElement("div");status.className="batch-state";status.textContent=item.result===null?"—":item.result?t("batchPassed"):t("batchFailed");
  const remove=document.createElement("button");remove.className="remove-sample";remove.type="button";remove.dataset.remove=item.id;remove.textContent=t("remove");right.append(status,remove);row.append(left,right);list.append(row);
 });
 $("#runBatchButton").disabled=false;$("#batchSummary").textContent=summary||state.batch.length+" "+t("sampleName");
}
function runBatch(){
 const schema=$("#schemaText").value.trim();if(!schema){notify(t("schemaNeeded"));return;}if(!state.batch.length){notify(t("noSamples"));return;}
 let passed=0,failed=0;
 state.batch.forEach(item=>{const parsed=parseJson(item.value);const result=parsed.ok?validateValue(schema,parsed.value):{valid:false};item.result=result.valid===true;if(item.result)passed++;else failed++;});
 renderBatch(t("batchDone")+": "+passed+" "+t("batchPassed")+" · "+failed+" "+t("batchFailed"));
}
async function copyJson(){
 if(!state.parsed)return;
 try{await navigator.clipboard.writeText(JSON.stringify(state.value,null,2));notify(t("copySuccess"));}
 catch(_){const area=document.createElement("textarea");area.value=JSON.stringify(state.value,null,2);document.body.append(area);area.select();const ok=document.execCommand("copy");area.remove();notify(ok?t("copySuccess"):t("copyFail"));}
}
function downloadJson(){
 if(!state.parsed)return;
 const blob=new Blob([JSON.stringify(state.value,null,2)+"\n"],{type:"application/json;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ai-structured-output.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify(t("downloadSuccess"));
}
function updateLanguage(){
 document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-i18n]").forEach(el=>{const value=t(el.dataset.i18n);if(value)el.textContent=value;});
 $("#languageButton").textContent=state.lang==="en"?"العربية":"English";
 $("#inputCount").textContent=$("#inputText").value.length+" "+t("characters");
 $("#year").textContent=new Date().getFullYear();
 if(state.parsed){$("#jsonOutput").textContent=JSON.stringify(state.value,null,2);badge("good",t("valid"));}
 renderBatch(state.batch.length?undefined:t("batchIdle"));
}
function setTheme(theme){state.theme=theme;document.documentElement.dataset.theme=theme;try{localStorage.setItem("kerlion-ai-json-debugger-theme",theme);}catch(_){}}
$("#inputText").addEventListener("input",()=>{$("#inputCount").textContent=$("#inputText").value.length+" "+t("characters");});
$("#analyzeButton").addEventListener("click",analyze);
$("#clearInputButton").addEventListener("click",()=>{
 $("#inputText").value="";$("#inputCount").textContent="0 "+t("characters");
 state.parsed=false;state.value=null;
 $("#diagnosisContent").innerHTML='<div class="empty-state">'+escapeHtml(t("emptyDiagnosis"))+'</div>';
 $("#jsonOutput").textContent=t("jsonPlaceholder");badge("neutral",t("waiting"));
 $("#copyJsonButton").disabled=true;$("#downloadJsonButton").disabled=true;$("#validateSchemaButton").disabled=true;
 clearSchemaResults();state.batch=[];renderBatch();
});
$("#loadSampleButton").addEventListener("click",()=>{$("#inputText").value=samples.response;$("#inputCount").textContent=samples.response.length+" "+t("characters");notify(t("loadNotice"));});
$("#schemaSampleButton").addEventListener("click",()=>{$("#schemaText").value=samples.schema;invalidateSchemaResults();notify(t("loadNotice"));});
$("#schemaText").addEventListener("input",invalidateSchemaResults);
$("#inputText").addEventListener("input",()=>{clearSchemaResults();state.batch.forEach(item=>item.result=null);if(state.batch.length)renderBatch();});
$("#copyJsonButton").addEventListener("click",copyJson);
$("#downloadJsonButton").addEventListener("click",downloadJson);
$("#validateSchemaButton").addEventListener("click",validateCurrent);
$("#addSampleButton").addEventListener("click",()=>addBatch());
$("#runBatchButton").addEventListener("click",runBatch);
$("#batchList").addEventListener("input",event=>{const row=event.target.closest(".batch-item");if(!row)return;const item=state.batch.find(x=>x.id===row.dataset.id);if(item){item.value=event.target.value;item.result=null;row.querySelector(".batch-state").textContent="—";}});
$("#batchList").addEventListener("click",event=>{const button=event.target.closest("[data-remove]");if(!button)return;state.batch=state.batch.filter(x=>x.id!==button.dataset.remove);renderBatch();});
$("#languageButton").addEventListener("click",()=>{state.lang=state.lang==="en"?"ar":"en";updateLanguage();});
$("#themeButton").addEventListener("click",()=>setTheme(state.theme==="dark"?"light":"dark"));
try{if(localStorage.getItem("kerlion-ai-json-debugger-theme")==="light")setTheme("light");}catch(_){}
$("#year").textContent=new Date().getFullYear();
if(new URLSearchParams(location.search).has("sample")){$("#inputText").value=samples.response;$("#schemaText").value=samples.schema;$("#inputCount").textContent=samples.response.length+" "+t("characters");}
})();