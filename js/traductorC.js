//==================================Constantes globales========================
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
//==============================Manejo de tabla de simbolos===================
let tbl_Aux=[];

function c_crearSimbolo(Direccion,Rol){
    return{
        Direccion:Direccion,
        Rol:Rol
    }
}

function c_nuevoSimbolo(Direccion,Rol){
    tbl_Aux.unshift(c_crearSimbolo(Direccion,Rol));
}
//============================================================================
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
    crearTemporales();
    contenido+=encabezado;
    contenido+=variables;
    contenido+=m_main;
    contenido+=codigo;//Codigo ya procesado
    contenido+="\n\treturn 0;\n}";
    txt_C.setValue(contenido);
}

function c_crearVariable(tipo,nombre,valor){
    codigo+=formato();
    if(tipo=="number"){
        codigo+="float ";
    }
    codigo+=nombre;
    c_procesarExpresion(valor,tipo);
    codigo+=";\n";
}
function c_procesarExpresion(valor,tipo){
    if(valor){
        switch (tipo){
            case "number":
                c_procesarExpNumerica(valor);
                break;
        }
    }
}
function c_procesarExpNumerica(valor){

    switch(expresion.tipo){
        case TIPO_VALOR.NUMERO:
            return expresion.valor;
    }

    if (expresion.tipo === TIPO_VALOR.NUMERO) {
        return expresion.valor;
    } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        
    }else if(expresion.tipo===TIPO_VALOR.LENGTH){
        
    }else if (expresion.tipo === TIPO_VALOR.ARREGLO) {
        if (tablaDeSimbolos.obtenerTipo(expresion.valor) == "number") {
            let simbolo=tablaDeSimbolos.obtenerVariable(expresion.valor)
            let valores=simbolo.valor;
            let indice=procesarExpresionNumerica(expresion.indice,tablaDeSimbolos);
            if(indice<valores.length){
                return valores[indice];
            }else{
                reportarError("Semantico", "El tamaño del arreglo: "+valores.length+"<br> es menor o igual al indice colocado: " + indice, 0, 0);
                return 0;
            } 
        } else {
            reportarError("Semantico", "No es de tipo numerico esta variable:<br>" + expresion.valor, 0, 0);
        }
    }else if (expresion.tipo === TIPO_VALOR.POP) {
        return procesarPop(expresion,tablaDeSimbolos);
    } else if (expresion.tipo === TIPO_OPERACION.SUMA
        || expresion.tipo === TIPO_OPERACION.RESTA
        || expresion.tipo === TIPO_OPERACION.MULTIPLICACION
        || expresion.tipo === TIPO_OPERACION.DIVISION) {

        const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.

        if (expresion.tipo === TIPO_OPERACION.SUMA) return valorIzq + valorDer;
        if (expresion.tipo === TIPO_OPERACION.RESTA) return valorIzq - valorDer;
        if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) return valorIzq * valorDer;
        if (expresion.tipo === TIPO_OPERACION.DIVISION) return valorIzq / valorDer;
    } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {

        const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
        return valor * -1;
    }else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {

        let valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        let valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);  

        return Math.pow(valorIzq,valorDer) ;
    }else if (expresion.tipo === TIPO_OPERACION.MODULAR) {

        const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
        return valorIzq % valorDer;
    }else if(expresion.tipo===TIPO_OPERACION.MAS){
        
        if(tipoDato(expresion.operandoDer,tablaDeSimbolos)=="number"&&tipoDato(expresion.operandoIzq,tablaDeSimbolos)=="number"){
            expresion.tipo=TIPO_OPERACION.SUMA;

        }else{
            expresion.tipo=TIPO_OPERACION.CONCATENACION;
        }
        
        let cadena=procesarExpresionCadena(expresion,tablaDeSimbolos);
       // console.log(JSON.stringify(expresion),"\n");
        return cadena;
    }

}




let tabs=1;
function formato(){
    let i=0;
    let regreso="";
    while(i<tabs){
        regreso+="\t";
        i++;
    }
    return regreso;
}