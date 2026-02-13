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

  loadTree();
  setInterval(autoSave,2000);
});

function autoSave(){
  if(currentFile){
    files[currentFile] = editor.getValue();
    localStorage.setItem("malk_files", JSON.stringify(files));
    updatePreview();
  }
}

function createFile(){
  const name = prompt("Nome do arquivo:");
  if(!name) return;
  files[name]="";
  save();
  loadTree();
}

function loadTree(){
  const tree=document.getElementById("fileTree");
  tree.innerHTML="";
  Object.keys(files).forEach(name=>{
    const div=document.createElement("div");
    div.textContent=name;
    div.draggable=true;

    div.ondragstart=(e)=>{
      e.dataTransfer.setData("text/plain",name);
    };

    div.onclick=()=>openFile(name);

    tree.appendChild(div);
  });

  tree.ondrop=(e)=>{
    e.preventDefault();
    const file=e.dataTransfer.getData("text");
    alert("Arquivo movido (visual apenas)");
  };

  tree.ondragover=(e)=>e.preventDefault();
}

function openFile(name){
  currentFile=name;
  editor.setValue(files[name]||"");
  updatePreview();
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
  const theme=document.body.classList.contains("light") ? "vs" : "vs-dark";
  monaco.editor.setTheme(theme);
}

/* RESIZER */
const resizer=document.getElementById("resizer");
const sidebar=document.getElementById("sidebar");

let isResizing=false;

resizer.addEventListener("mousedown",()=>isResizing=true);
document.addEventListener("mousemove",(e)=>{
  if(!isResizing) return;
  sidebar.style.width=e.clientX+"px";
});
document.addEventListener("mouseup",()=>isResizing=false);

function save(){
  localStorage.setItem("malk_files",JSON.stringify(files));
}
