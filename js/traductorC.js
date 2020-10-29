//==================================Constantes globales========================
let encabezado="";
encabezado+="#include <stdio.h>\n";
encabezado+="#include <math.h>\n";
encabezado+="float heap[16384];\n";
encabezado+="float stack[16394];\n";
encabezado+="float p;\n";
encabezado+="float h;\n\n";
let variables="";
let m_main="";
let codigo="";
m_main+="int main() {\n";
let p=0;
let memoria=0;
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

function c_crearVariable(tipo,nombre,valor,tablaDeSimbolos){
    
    const variable=tablaDeSimbolos.obtenerVariable(nombre);
    let valorAux=c_procesarExpresion(valor,tipo,tablaDeSimbolos);
    if(valorAux){
        codigo+=formato();
        codigo+="stack["+variable.memoria+"]"+"="+valorAux+";\n";
    }
}
function c_procesarExpresion(valor,tipo,tablaDeSimbolos){
    
    if(valor){
        switch (tipo){
            case "number":
            case TIPO_VALOR.NUMERO:
            case TIPO_OPERACION.SUMA:
            case TIPO_OPERACION.RESTA:
            case TIPO_OPERACION.DIVISION:
            case TIPO_OPERACION.MULTIPLICACION:
            case TIPO_OPERACION.MODULAR:
            case TIPO_OPERACION.POTENCIA:
                return c_procesarExpNumerica(valor,tablaDeSimbolos);
            case TIPO_VALOR.IDENTIFICADOR:
                const variable=tablaDeSimbolos.obtenerVariable(valor.valor);
                return "stack["+variable.memoria+"]";
        }
    }
}
function c_procesarExpNumerica(expresion,tablaDeSimbolos){
    
    switch(expresion.tipo){
        case TIPO_VALOR.NUMERO:
            return expresion.valor.toFixed(8);
        case TIPO_OPERACION.SUMA:
        case TIPO_OPERACION.RESTA:
        case TIPO_OPERACION.DIVISION:
        case TIPO_OPERACION.MULTIPLICACION:
        case TIPO_OPERACION.MODULAR:
        case TIPO_OPERACION.POTENCIA:
            const valorIzq = c_procesarExpNumerica(expresion.operandoIzq,tablaDeSimbolos);      // resolvemos el operando izquierdo.
            const valorDer = c_procesarExpNumerica(expresion.operandoDer,tablaDeSimbolos);      // resolvemos el operando derecho.
            codigo+=formato();
            noTemporal++;
            if (expresion.tipo === TIPO_OPERACION.SUMA)           {codigo+="t"+noTemporal+"="+valorIzq+"+"+valorDer+";\n";}
            if (expresion.tipo === TIPO_OPERACION.RESTA)          {codigo+="t"+noTemporal+"="+valorIzq+"-"+valorDer+";\n";}
            if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {codigo+="t"+noTemporal+"="+valorIzq+"*"+valorDer+";\n";}
            if (expresion.tipo === TIPO_OPERACION.DIVISION)       {codigo+="t"+noTemporal+"="+valorIzq+"/"+valorDer+";\n";}
            if (expresion.tipo === TIPO_OPERACION.MODULAR)        {codigo+="t"+noTemporal+"="+valorIzq+"%"+valorDer+";\n";}
            if (expresion.tipo === TIPO_OPERACION.POTENCIA)       {codigo+="t"+noTemporal+"="+"pow("+valorIzq+","+valorDer+");\n";}      
            return "t"+noTemporal;
        case TIPO_VALOR.IDENTIFICADOR:
            const variable=tablaDeSimbolos.obtenerVariable(expresion.valor);
            return "stack["+variable.memoria+"]";
    }

}

function c_asignarVariable(nombre,valor,tipo,tablaDeSimbolos){
   
    let valorAux=c_procesarExpresion(valor,tipo,tablaDeSimbolos);
    const variable=tablaDeSimbolos.obtenerVariable(nombre);
    if(valorAux){
        codigo+=formato();
        codigo+="stack["+variable.memoria+"]"+"="+valorAux+";\n";
    }
}

function c_procesarImprimir(contenido,tablaDeSimbolos){
    let tipo=contenido.tipo;
    //printf("%f",12.00);
    let valorAux=c_procesarExpresion(contenido,tipo,tablaDeSimbolos);
    codigo+=formato();
    if(tipo==TIPO_VALOR.NUMERO||tipo== TIPO_OPERACION.SUMA||tipo== TIPO_OPERACION.RESTA||tipo== TIPO_OPERACION.DIVISION||tipo== TIPO_OPERACION.MULTIPLICACION||tipo== TIPO_OPERACION.MODULAR||tipo== TIPO_OPERACION.POTENCIA){
        codigo+="printf(\"%f\","+valorAux+");\n";
    }
    if(tipo==TIPO_VALOR.IDENTIFICADOR){
        const variable=tablaDeSimbolos.obtenerVariable(contenido.valor);

        codigo+="printf(\"%f\",stack["+variable.memoria+"]);\n";
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