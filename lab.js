let editor;
let files = JSON.parse(localStorage.getItem("malk_files")) || {};
let currentFile = null;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }});

require(['vs/editor/editor.main'], function () {

  editor = monaco.editor.create(document.getElementById('editor'), {
    value: "",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout:true,
    minimap:{ enabled:true }
  });

  loadFiles();
  setInterval(autoSave,1500);
});

function autoSave(){
  if(currentFile){
    files[currentFile]=editor.getValue();
    localStorage.setItem("malk_files",JSON.stringify(files));
    updatePreview();
  }
}

function createFile(){
  const name=prompt("Nome do arquivo (ex: index.html):");
  if(!name) return;
  files[name]="";
  save();
  loadFiles();
}

function loadFiles(){
  const list=document.getElementById("fileList");
  list.innerHTML="";
  Object.keys(files).forEach(name=>{
    const div=document.createElement("div");
    div.textContent=name;
    div.onclick=()=>openFile(name);
    list.appendChild(div);
  });
}

function openFile(name){
  currentFile=name;
  editor.setValue(files[name]||"");
  addTab(name);
  updatePreview();
}

function addTab(name){
  if(window.innerWidth<900) return;
  const tabs=document.getElementById("tabs");
  if([...tabs.children].some(t=>t.textContent===name)) return;
  const tab=document.createElement("div");
  tab.className="tab active";
  tab.textContent=name;
  tab.onclick=()=>openFile(name);
  tabs.appendChild(tab);
}

function updatePreview(){
  if(currentFile && currentFile.endsWith(".html")){
    document.getElementById("preview").srcdoc=editor.getValue();
  }
}

function downloadProject(){
  const zip=new JSZip();
  Object.keys(files).forEach(name=>{
    zip.file(name,files[name]);
  });
  zip.generateAsync({type:"blob"}).then(content=>{
    const a=document.createElement("a");
    a.href=URL.createObjectURL(content);
    a.download="malklabs-project.zip";
    a.click();
  });
}

function toggleTheme(){
  document.body.classList.toggle("light");
  const theme=document.body.classList.contains("light")?"vs":"vs-dark";
  monaco.editor.setTheme(theme);
}

/* Resizer */
const resizer=document.getElementById("resizer");
const sidebar=document.getElementById("sidebar");
let resizing=false;

resizer.onmousedown=()=>resizing=true;
document.onmousemove=(e)=>{
  if(resizing){
    sidebar.style.width=e.clientX+"px";
  }
};
document.onmouseup=()=>resizing=false;

function save(){
  localStorage.setItem("malk_files",JSON.stringify(files));
}
