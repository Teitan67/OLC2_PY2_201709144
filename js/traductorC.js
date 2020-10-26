let encabezado="";
encabezado+="#include <stdio.h>\n\n";
encabezado+="float heap[16384];\n";
encabezado+="float stack[16394];\n";
encabezado+="float p;\n";
encabezado+="float h;\n\n";
let variables="";
let m_main="";
let codigo="";
m_main+="int main() {\n";

let noTemporal=0;

function crearTemporales(){
    if(noTemporal!=0){
        variables="";
        variables="float ";
        for(let i=1;i<noTemporal;i++){
            variables+="t"+i+" ,";
        }
        variables+="t"+noTemporal+";";
        variables+="\n";
    }
}
function traducir_a_C(){
    let contenido="";
    txt_C.setValue("");

    //PROCESAR CODIGO
    traducir_c(ast);

    crearTemporales();
    contenido+=encabezado;
    contenido+=variables;
    contenido+=m_main;
    contenido+=codigo;
    contenido+="\n\treturn 0;\n}";
    txt_C.setValue(contenido);
}

function traducir_c(ast){
    console.log(JSON.stringify(ast));
    codigo+="\tprintf(\"%d\", (int)900);";
}