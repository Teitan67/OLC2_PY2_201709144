// Temas
var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: "javascript",
  theme: "darcula",
  firstLineNumber: 0
});
var editorJSON =document.getElementById('JSONviwer');

function mostrarJSON(json){
  editorJSON.value="";
  editorJSON.value=json;
}
//Funcionalidades nativas
function consolAdd(texto) {
  var txtConsola = document.getElementById('consol');
  txtConsola.value = txtConsola.value + texto + "\n";
}

function consolClear() {
  var txtConsola = document.getElementById('consol');
  txtConsola.value = "";
}
//Agregar error
var noErrores = 0;
function reportarError(tipo, descripcion, columna, linea) {
  ++noErrores;
  var tabla = document.getElementById("tabla");
  tabla.insertAdjacentHTML("beforeend", "<tr id='Cuerpo'><td>" + noErrores + "</td><td>" + tipo + "</td><td>" + descripcion + "</td><td>" + columna + "</td><td>" + linea + "</td></tr>");
}

let ast ;
let tsGlobal;

//Funciones del compilador
function analizar() {
  tsGlobal = new TS([]);
  ambito=ambGlobal;
  funcionesTabla = [];
  limpiar();
  texto = editor.getValue();
  ast = compilador.parse(texto);
  mostrarJSON(JSON.stringify(ast)); 
  procesarPrograma(ast, tsGlobal);
   
}

function limpiar(){
  consolClear();
  limpiarAmb();
  $("#tabla #Cuerpo").remove(); 
  noErrores = 0 ;
}

function limpiarAmb(){
  noVariables=0;
  $("#tabla-amb #Cuerpop").remove(); 
  $("#tabla-amb #Cabeza-mb").remove(); 
}

let noVariables=0;

function addVariable(nombre, tipo, ambito,fila,columna) {
  ++noVariables;
  var tabla = document.getElementById("tabla-amb");
  tabla.insertAdjacentHTML("beforeend", "<tr id='Cuerpop'><td>" + noVariables + "</td><td>" + nombre + "</td><td>" + tipo + "</td><td>" + ambito+"</td><td>" + fila + "</td><td>" + columna+"</td></tr>");

}
function copiarAST() {
  var copyText = document.getElementById("JSONviwer");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

switch (key) {
  case value:
    
    break;

  default:
    break;
}