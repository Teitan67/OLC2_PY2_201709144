// Procesamos las instrucciones reconocidas en nuestro AST
//LA VARIABLE codigo colocamos la traduccion a C
function procesarPrograma(instrucciones, tablaDeSimbolos) {
    let programa = instrucciones.programa;
    let tabla=tablaDeSimbolos;
    for(let Lsentencia of programa){
        for(let sentencia of Lsentencia){
            if(sentencia.tipo==TIPO_INSTRUCCION.FUNCION_NUEVA){
                crearFuncion(sentencia,tabla);
            }else{
                procesarBloque(Lsentencia,tabla);
                break;
            }
        }
    }
}

function crearFuncion(instrucciones, tablaDeSimbolos){
    funcionesTabla.push(instrucciones);
}

function procesarBloque(instrucciones, tablaDeSimbolos) {
    for (let instruccion of instrucciones) {
        if (instruccion.tipo === TIPO_INSTRUCCION.IMPRIMIR) {  
            procesarImprimir(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo === TIPO_INSTRUCCION.CREAR_VARIABLE) {
            procesarCreacionVariable(instruccion, tablaDeSimbolos);
        } else if (instruccion.tipo == TIPO_INSTRUCCION.ERROR) {
            console.log("Recuperacion activada!");
        } else if (instruccion.tipo == TIPO_INSTRUCCION.GRAFICAR) {
            graficar(tablaDeSimbolos);
        } else if (instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION) {
            procesarAsignaciones(instruccion, tablaDeSimbolos);
        } else if(instruccion.tipo==TIPO_INSTRUCCION.IF){
            let auxAmbito=ambito;
            nuevoAmbito();
            let regreso = procesarIf(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else if(instruccion.tipo==TIPO_INSTRUCCION.WHILE){
            let auxAmbito=ambito;
            nuevoAmbito();
            let regreso=procesarWhile(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else if(instruccion.tipo==TIPO_INSTRUCCION.DO_WHILE){
            let auxAmbito=ambito;
            nuevoAmbito();
            procesarDoWhile(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else if(instruccion.tipo==TIPO_INSTRUCCION.INCREMENTO){
            procesarIncremento(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.DECREMENTO){
            procesarDecremento(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.FOR){
            let auxAmbito=ambito;
            nuevoAmbito();
            let regreso=procesarFor(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else if(instruccion.tipo==TIPO_INSTRUCCION.CREAR_ARREGLO){
            procesarCrearArreglo(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.ASIGNAR_ARREGLO){
            procesarAsignacionArreglo(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.PUSH){
            procesarPush(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.FOR_IN){
            let auxAmbito=ambito;
            nuevoAmbito();
            let regreso=procesarForIn(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else if(instruccion.tipo===TIPO_INSTRUCCION.FOR_OF){
            let auxAmbito=ambito;
            nuevoAmbito();
            let regreso=procesarForOf(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else if(instruccion.tipo===TIPO_INSTRUCCION.FUNCION_LLAMAR){
            procesarFuncion(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.RETURN){
            return procesarReturn(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.BREAK){
            return 0;
        }else if(instruccion.tipo===TIPO_INSTRUCCION.SWITCH){
            let auxAmbito=ambito;
            nuevoAmbito();
            let regreso=procesarSwitch(instruccion,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
        }else {
            console.error('ERROR: tipo de instrucción no válido: ' + JSON.stringify(instruccion));
        }
    }
}
function procesarSwitch(instruccion,tablaDeSimbolos){
    let comparador =procesarExpresionCadena(instruccion.comparando,tablaDeSimbolos);
    let casos=instruccion.casos;
    let regreso=null;
    let default_=null;
    for(let caso of casos ){
        
        let comparando2=procesarExpresionCadena(caso.comparador,tablaDeSimbolos);
        if(comparando2==comparador){
            regreso= procesarBloque(caso.sentencias,tablaDeSimbolos);
            if(regreso!=null){
                return regreso;
            }
        }else if(comparando2=="default"){
            default_=caso;
        }
    }
    
    regreso=procesarBloque(default_.sentencias,tablaDeSimbolos);
    if(regreso!=null){
        return regreso;
    }
}
function procesarReturn(instruccion,tablaDeSimbolos){
    if(instruccion.regreso){
        let retorno = procesarExpresionCadena(instruccion.regreso,tablaDeSimbolos);
        return retorno;
    }else{
        return null;
    }
}
function procesarFuncion(instruccion,tablaDeSimbolos){
    
    let funcion=obtenerFuncion(instruccion.identificador);   
    if(funcion!==null){
        let auxAmbito=ambito;
        nuevoAmbito();
        let parametros_entrada=instruccion.parametros;
        let parametros_funcion=funcion.parametros;
        let variables_locales=[];
        let auxVarianle=null;
        if (parametros_entrada.length==parametros_funcion.length){
            for (let i in parametros_entrada) {
                auxVarianle=parametros_funcion[i];
                variables_locales.unshift(instruccionesAST.crearVariable(auxVarianle.identificador,auxVarianle.tipo_Var,parametros_entrada[i],funcion.fila,funcion.columna));
            }
            let ast_parametro=instruccionesAST.nuevaVariable("let",variables_locales);
            procesarCreacionVariable(ast_parametro, tablaDeSimbolos);
            let regreso=procesarBloque(funcion.sentencias,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos); 
            return regreso;
            
        }else{
            reportarError("Semantico", "La siguiente funcion "+instruccion.identificador+"<br> tiene un numero de parametros invalidos" , instruccion.fila, instruccion.columna); 
        }
       
    }else{
        reportarError("Semantico", "La siguiente funcion "+instruccion.identificador+"<br> no existe" , instruccion.fila, instruccion.columna); 
    }
}

function procesarCreacionVariable(instruccion, tablaDeSimbolos) {
    let acceso = instruccion.acceso;
    for (let variable of instruccion.variables) {
        if (tablaDeSimbolos.verificarInsertarAsig(variable.identificador,ambito)) {
            if (puedoInsertar(variable.valor, variable.tipo_var,tablaDeSimbolos, variable.fila,variable.columna)) {
                if (variable.tipo === TIPO_OPERACION.CREAR_VAR) {
                    let val = null;
                    let tipo_var = variable.tipo_var;
                    if (variable.valor) {
                        tipo_var = tipoDato(variable.valor,tablaDeSimbolos);
                        val = procesarExpresionCadena(variable.valor, tablaDeSimbolos);
                    }
                    if (variable.valor==null&&acceso=="const") {
                        reportarError("Semantico", "La variable es una constante y<br> debe asignarse un dato ",  variable.fila,variable.columna); 
                    }else{
                         tablaDeSimbolos.agregar(acceso, variable.identificador, tipo_var, val,variable.fila,variable.columna);
                         c_crearVariable(tipo_var, variable.identificador,variable.valor);
                    }
                   
                } else {
                    console.error("Operacion sin sentido dentro del AST " + variable);
                }
            }else{
                reportarError("Semantico", "La siguiente variable "+variable.identificador+"<br> no acepta tipos de datos<br> que se intentan insertar" , variable.fila,variable.columna);
            }
        } else {
            reportarError("Semantico", "La siguiente variable ya existe:<br>" + variable.identificador, variable.fila,variable.columna);
        }
    }
}

function procesarImprimir(instruccion, tablaDeSimbolos) {
    
    const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos);
    consolAdd(cadena);
}
function procesarExpresionCadena(expresion, tablaDeSimbolos) {

    //console.log(expresion);
    if (expresion.tipo === TIPO_OPERACION.CONCATENACION) {
        
        let cadIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        let cadDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
        if(cadIzq==null){
            cadIzq="";
        } 
        if(cadDer==null){
            cadDer="";
        }
        return cadIzq.toString() + cadDer.toString();
    } else if (expresion.tipo === TIPO_VALOR.CADENA) {
        
        let val = parseCadena.parse(expresion.valor);
        
        return val;
    } else if (expresion.tipo === TIPO_VALOR.NUMERO
        || expresion.tipo === TIPO_OPERACION.SUMA
        || expresion.tipo === TIPO_OPERACION.RESTA
        || expresion.tipo === TIPO_OPERACION.MULTIPLICACION
        || expresion.tipo === TIPO_OPERACION.DIVISION
        || expresion.tipo === TIPO_OPERACION.NEGATIVO
        || expresion.tipo === TIPO_OPERACION.POTENCIA
        || expresion.tipo === TIPO_OPERACION.MODULAR
        || expresion.tipo === TIPO_VALOR.LENGTH
    ) {
        return procesarExpresionNumerica(expresion, tablaDeSimbolos);
    } else if ( (expresion.tipo === TIPO_VALOR.ARREGLO||expresion.tipo === TIPO_VALOR.POP)&&(tablaDeSimbolos.obtenerTipo(expresion.valor) == "number")) {
        return procesarExpresionNumerica(expresion, tablaDeSimbolos);
    }else if (expresion.tipo === TIPO_OPERACION.MAYOR_QUE
        || expresion.tipo === TIPO_OPERACION.MENOR_QUE
        || expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL
        || expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
        return procesarExpresionLogicaNumerica(expresion, tablaDeSimbolos);
    } else if (expresion.tipo === TIPO_OPERACION.IGUAL || expresion.tipo === TIPO_OPERACION.DIFERENTE) {
        return procesarExpresionLogica(expresion, tablaDeSimbolos);
    } else if (expresion.tipo === TIPO_VALOR.BOOLEANO) {
        return expresion.valor;
    } else if (expresion.tipo === TIPO_OPERACION.AND || expresion.tipo === TIPO_OPERACION.OR || expresion.tipo === TIPO_OPERACION.NEGACION) {
        return procesarExpresionComparativa(expresion, tablaDeSimbolos);
    } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        //mimir
        return procesarConsultaVariable(expresion, tablaDeSimbolos);
    }else if ((expresion.tipo === TIPO_VALOR.ARREGLO)&&(tablaDeSimbolos.obtenerTipo(expresion.valor) == "boolean")) {
        if (tablaDeSimbolos.obtenerTipo(expresion.valor) == "boolean") {
            let simbolo=tablaDeSimbolos.obtenerVariable(expresion.valor)
            let valores=simbolo.valor;
            let indice=procesarExpresionNumerica(expresion.indice,tablaDeSimbolos);
            if(indice<valores.length){
                return valores[indice];
            }else{
                reportarError("Semantico", "El tamaño del arreglo: "+valores.length+" es menor o igual al indice colocado: " + indice, simbolo.fila, simbolo.columna);
                return 0;
            } 
        } else {
            reportarError("Semantico", "No es de tipo booleano esta variable:<br>" + expresion.valor, variable.fila, variable.columna);
        }
    } else if (expresion.tipo === TIPO_VALOR.POP&&(tablaDeSimbolos.obtenerTipo(expresion.valor) == "boolean")) {
        return procesarPop(expresion,tablaDeSimbolos);
    } else if (expresion.tipo === TIPO_VALOR.POP&&(tablaDeSimbolos.obtenerTipo(expresion.valor) == "String")) {
        return procesarPop(expresion,tablaDeSimbolos);
    }else if (expresion.tipo === TIPO_VALOR.ARREGLO&&tablaDeSimbolos.obtenerTipo(expresion.valor) == "String") {
        if (tablaDeSimbolos.obtenerTipo(expresion.valor) == "String") {
            let simbolo=tablaDeSimbolos.obtenerVariable(expresion.valor)
            let valores=simbolo.valor;
            let indice=procesarExpresionNumerica(expresion.indice,tablaDeSimbolos);
            if(indice<valores.length){
                return valores[indice];
            }else{
                reportarError("Semantico", "El tamaño del arreglo: "+valores.length+" es menor o igual al indice colocado: " + indice, simbolo.fila, simbolo.columna);
                return 0;
            } 
        } else {
            reportarError("Semantico", "No es de tipo STRING esta variable:<br>" + expresion.valor, expresion.fila, expresion.columna);
        }
    }else if(expresion.tipo===TIPO_OPERACION.MAS){
        
        if(tipoDato(expresion.operandoDer,tablaDeSimbolos)=="number"&&tipoDato(expresion.operandoIzq,tablaDeSimbolos)=="number"){
            expresion.tipo=TIPO_OPERACION.SUMA;

        }else{
            expresion.tipo=TIPO_OPERACION.CONCATENACION;
        }
        
        let cadena=procesarExpresionCadena(expresion,tablaDeSimbolos);
        
        return cadena;
    }else if(expresion.tipo===TIPO_INSTRUCCION.FUNCION_LLAMAR){
        return procesarFuncion(expresion,tablaDeSimbolos);
    }else if(expresion.tipo==TIPO_VALOR.CHAR_AT){
        return procesarCharAt(expresion,tablaDeSimbolos);
    }else if(expresion.tipo==TIPO_VALOR.LowerCase){
        return procesarLowerCase(expresion,tablaDeSimbolos);
    }else if(expresion.tipo==TIPO_VALOR.UpperCase){
        return procesarUpperCase(expresion,tablaDeSimbolos);
    }else {
        console.error("Instruccion no reconocida: " + JSON.stringify(expresion));
    }
}
function procesarCharAt(expresion,tablaDeSimbolos){
    let cadena = procesarExpresionCadena(expresion.identificador,tablaDeSimbolos);
    let numero = procesarExpresionNumerica(expresion.indice,tablaDeSimbolos);
    let caracter=cadena.charAt(numero);
    return caracter;
}
function  procesarUpperCase(expresion,tablaDeSimbolos){
    let cadena = procesarExpresionCadena(expresion.cadena,tablaDeSimbolos);
    return cadena.toUpperCase();
}
function procesarLowerCase(expresion,tablaDeSimbolos){
    let cadena = procesarExpresionCadena(expresion.cadena,tablaDeSimbolos);
    return cadena.toLowerCase();
}
function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
    
    if (expresion.tipo === TIPO_VALOR.NUMERO) {
        return expresion.valor;
    } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        
        if (tablaDeSimbolos.obtenerTipo(expresion.valor) == "number") {
            return procesarConsultaVariable(expresion, tablaDeSimbolos);
        } else {
            reportarError("Semantico", "No es de tipo numerico esta variable:<br>" + expresion.valor, 0, 0);
        }
    }else if(expresion.tipo===TIPO_VALOR.LENGTH){
        return tablaDeSimbolos.getLength(expresion.identificador);
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
function procesarExpresionLogicaNumerica(expresion, tablaDeSimbolos) {
    // En este caso necesitamos procesar los operandos antes de realizar la comparación.
    const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
    const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.

    if (expresion.tipo === TIPO_OPERACION.MAYOR_QUE) return valorIzq > valorDer;
    if (expresion.tipo === TIPO_OPERACION.MENOR_QUE) return valorIzq < valorDer;
    if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) return valorIzq >= valorDer;
    if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) return valorIzq <= valorDer;

}
function procesarExpresionLogica(expresion, tablaDeSimbolos) {
    const valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
    const valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
    
    if (expresion.tipo === TIPO_OPERACION.IGUAL){ return (valorIzq) == (valorDer);}
    if (expresion.tipo === TIPO_OPERACION.DIFERENTE) {return (valorIzq) != (valorDer);}

}
function procesarExpresionComparativa(expresion, tablaDeSimbolos) {

    if (expresion.tipo === TIPO_OPERACION.NEGACION) {

        let valor = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
        if(valor==true||valor=="true"){
            return false;
        }else if(valor==false||valor=="false"){
            return true;
        }else{
            return !valor;
        }
    } else {
        const valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.

        if (expresion.tipo === TIPO_OPERACION.AND) return Boolean(valorIzq) && Boolean(valorDer);
        if (expresion.tipo === TIPO_OPERACION.OR) return valorIzq || valorDer;
    }
}
function graficar(tablaDeSimbolos) {
    noVariables=0;
    var tabla = document.getElementById("tabla-amb");
    
    tabla.insertAdjacentHTML("beforeend", "<tr id =\"Cabeza-mb\"><td> No.</td><td> Nombre </td><td> Tipo </td><td> Ambito</td><td> Fila </td><td> Columna</td></tr>");
    
    for (const variable of tablaDeSimbolos._simbolos) {
        addVariable(variable.id, variable.tipo, variable.ambito,variable.fila,variable.columna);
    }
}
function puedoInsertar(expresion, tipo,tablaDeSimbolos,fila,columna) {
    if (tipo === null || expresion === null) {
        return true;
    }
    if (expresion.tipo === TIPO_OPERACION.CONCATENACION && (tipo === "String" || tipo === "string")) {
        return true;
    } else if (expresion.tipo === TIPO_VALOR.CADENA && (tipo === "String" || tipo === "string")) {
        return true;
    } else if ((expresion.tipo === TIPO_VALOR.NUMERO
        || expresion.tipo === TIPO_OPERACION.SUMA
        || expresion.tipo === TIPO_OPERACION.RESTA
        || expresion.tipo === TIPO_OPERACION.MULTIPLICACION
        || expresion.tipo === TIPO_OPERACION.DIVISION
        || expresion.tipo === TIPO_OPERACION.NEGATIVO
        || expresion.tipo === TIPO_OPERACION.POTENCIA
        || expresion.tipo === TIPO_OPERACION.MODULAR
    ) && tipo === "number") {
        return true;
    } else if ((expresion.tipo === TIPO_OPERACION.MAYOR_QUE
        || expresion.tipo == TIPO_OPERACION.MENOR_QUE
        || expresion.tipo == TIPO_OPERACION.MAYOR_IGUAL
        || expresion.tipo == TIPO_OPERACION.MENOR_IGUAL) && tipo === "boolean") {
        return true;
    } else if ((expresion.tipo === TIPO_OPERACION.IGUAL || expresion.tipo === TIPO_OPERACION.DIFERENTE) && tipo === "boolean") {
        return true;
    } else if ((expresion.tipo == TIPO_VALOR.BOOLEANO) && tipo === "boolean") {
        return true;
    } else if ((expresion.tipo == TIPO_OPERACION.AND || expresion.tipo === TIPO_OPERACION.OR || expresion.tipo === TIPO_OPERACION.NEGACION) && tipo === "boolean") {
        return true;
    }else if(expresion.tipo == TIPO_VALOR.IDENTIFICADOR||(expresion.tipo == TIPO_VALOR.ARREGLO)||(expresion.tipo == TIPO_VALOR.POP)){
        if( tipo===tablaDeSimbolos.obtenerTipo(expresion.valor)){
            return  tipo===tablaDeSimbolos.obtenerTipo(expresion.valor);
        }else{
            if(tipo==="String"&&"boolean"==tablaDeSimbolos.obtenerTipo(expresion.valor)){
                return true
            }
            return false;
        }
        
    } else if(expresion.tipo == TIPO_VALOR.LENGTH&& tipo === "number"){
        return true;
    }  else if(expresion.tipo == "INSTR_FUNCION_LLAMADA"){
        return true;
    }else if(expresion.tipo===TIPO_OPERACION.MAS){
        
        if(tipoDato(expresion.operandoDer,tablaDeSimbolos)=="number"&&tipoDato(expresion.operandoIzq,tablaDeSimbolos)=="number"){
           return true

        }else{
            
           return true;
        }

    }else {
        reportarError("Semantico", "No coinciden los datos:<br>" + "La variable es de tipo " + tipo + "<br>El valor es de tipo:<br>" + JSON.stringify(expresion.tipo), fila, columna);
        return false;
    }
}

function tipoDato(expresion,tablaDeSimbolos) {
    
    if (expresion === null||expresion===undefined) {
        return null;
    }
    if (expresion.tipo === TIPO_OPERACION.CONCATENACION) {
        return "String";
    } else if (expresion.tipo === TIPO_VALOR.CADENA) {
        return "String";
    } else if ((expresion.tipo === TIPO_VALOR.NUMERO
        || expresion.tipo === TIPO_OPERACION.SUMA
        || expresion.tipo === TIPO_OPERACION.RESTA
        || expresion.tipo === TIPO_OPERACION.MULTIPLICACION
        || expresion.tipo === TIPO_OPERACION.DIVISION
        || expresion.tipo === TIPO_OPERACION.NEGATIVO
        || expresion.tipo === TIPO_OPERACION.POTENCIA
        || expresion.tipo === TIPO_OPERACION.MODULAR
    )) {
        return "number";
    } else if ((expresion.tipo === TIPO_OPERACION.MAYOR_QUE
        || expresion.tipo == TIPO_OPERACION.MENOR_QUE
        || expresion.tipo == TIPO_OPERACION.MAYOR_IGUAL
        || expresion.tipo == TIPO_OPERACION.MENOR_IGUAL)) {
        return "boolean";
    } else if ((expresion.tipo === TIPO_OPERACION.IGUAL || expresion.tipo === TIPO_OPERACION.DIFERENTE)) {
        return "boolean";
    } else if ((expresion.tipo == TIPO_VALOR.BOOLEANO)) {
        return "boolean";
    } else if ((expresion.tipo == TIPO_OPERACION.AND || expresion.tipo === TIPO_OPERACION.OR || expresion.tipo === TIPO_OPERACION.NEGACION) ) {
        return "boolean";
    }else if(expresion.tipo == TIPO_VALOR.IDENTIFICADOR||expresion.tipo == TIPO_VALOR.ARREGLO||expresion.tipo == TIPO_VALOR.POP){
        return tablaDeSimbolos.obtenerTipo(expresion.valor);
    } else if(expresion.tipo == TIPO_VALOR.LENGTH){
        return "number";
    }else if(expresion.tipo===TIPO_OPERACION.MAS){
        
        if(tipoDato(expresion.operandoDer,tablaDeSimbolos)=="number"&&tipoDato(expresion.operandoIzq,tablaDeSimbolos)=="number"){
            return "number";

        }else{
            return null;
        }

    }else {

        return null;
    }
}

function procesarConsultaVariable(expresion, tablaDeSimbolos) {

    return tablaDeSimbolos.obtener(expresion.valor);
    //instruccionesAST.TIPO_VALOR(tipo,valor);
}

function procesarIf(instruccion,tablaDeSimbolos){
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();
    if(condicion==="true"){
        let regreso =procesarBloque(instruccion.sentencias,tablaDeSimbolos);
        if(regreso){
            return regreso;
        }
    }else{
        if(instruccion.elseIf!="null"){
            if(instruccion.elseIf.tipo==TIPO_INSTRUCCION.ELSE){
                let regreso=procesarBloque(instruccion.elseIf.sentencias,tablaDeSimbolos);
                if(regreso){
                    return regreso;
                }
            }else{
                procesarIf(instruccion.elseIf,tablaDeSimbolos);
            }
            
        }
    }
    
}

function procesarAsignaciones(instruccion, tablaDeSimbolos) {
    for (let variable of instruccion.asignacion) {
        if (!tablaDeSimbolos.verificarInsertar(variable.identificador)) {
            let auxVariable = tablaDeSimbolos.obtenerVariable(variable.identificador);
            if (puedoInsertar(variable.valor,auxVariable.tipo,tablaDeSimbolos, variable.fila,variable.columna)) {
                if(auxVariable.acceso!="const"&&(auxVariable.valor!="null"||auxVariable.valor!=null)){
                    auxVariable.tipo=tipoDato(variable.valor,tablaDeSimbolos);
                    auxVariable.valor = procesarExpresionCadena(variable.valor,tablaDeSimbolos);
                    
                    tablaDeSimbolos.enviarVariable(auxVariable.id,auxVariable);
                }else{
                    
                    reportarError("Semantico", "La variable es una constante y<br> no puede cambiar de dato ",  variable.fila,variable.columna);    
                }
            }else {
                reportarError("Semantico", "La variable es de tipo: " + auxVariable.tipo+"<br>El valor es de tipo:<br>"+JSON.stringify(variable.valor),  variable.fila,variable.columna);
            }
        } else {
            reportarError("Semantico", "No se puede insertar en:<br>" + variable.identificador+"<br> ya que no existe",  variable.fila,variable.columna);
        }
    }
}

function procesarWhile(instruccion,tablaDeSimbolos){
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();
    let a=instruccion.condicion;
    
    if(a.tipo){
        if(a.tipo=="VAL_BOOLEANO"){
            reportarError("Semantico", "No se puede colocar un valor fijo en un ciclo",  0,0);
            return null;
        }
    }
    while (condicion==="true") {
        let regreso=procesarBloque(instruccion.sentencias,tablaDeSimbolos);
        if(regreso){
            return regreso;
        }
        condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
        condicion=condicion.toString();
    }
}

function procesarDoWhile(instruccion,tablaDeSimbolos){
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();
    do{
        let regreso =procesarBloque(instruccion.sentencias,tablaDeSimbolos);
        if(regreso){
            return regreso;
        }
        condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
        condicion=condicion.toString();

    }while (condicion==="true")

}

function procesarIncremento(instruccion,tablaDeSimbolos){
    let id=instruccion.identificador;
    let valorIzq=instruccionesAST.nuevoValor(id,TIPO_VALOR.IDENTIFICADOR);
    let valorDer= instruccionesAST.nuevoValor(Number(1), TIPO_VALOR.NUMERO);
    let suma=instruccionesAST.nuevoOperacionBinaria(valorIzq,valorDer,TIPO_OPERACION.SUMA);
    let asignacion=instruccionesAST.nuevaAsignacion(id,suma);
    let asignaciones=[];
    asignaciones.push(asignacion);
    let inst_incremento=instruccionesAST.nuevasAsignaciones(asignaciones);
    procesarAsignaciones(inst_incremento,tablaDeSimbolos);
}

function procesarDecremento(instruccion,tablaDeSimbolos){
    let id=instruccion.identificador;
    let valorIzq=instruccionesAST.nuevoValor(id,TIPO_VALOR.IDENTIFICADOR);
    let valorDer= instruccionesAST.nuevoValor(Number(1), TIPO_VALOR.NUMERO);
    let suma=instruccionesAST.nuevoOperacionBinaria(valorIzq,valorDer,TIPO_OPERACION.RESTA);
    let asignacion=instruccionesAST.nuevaAsignacion(id,suma);
    let asignaciones=[];
    asignaciones.push(asignacion);
    let inst_incremento=instruccionesAST.nuevasAsignaciones(asignaciones);
    procesarAsignaciones(inst_incremento,tablaDeSimbolos);
}

function procesarFor(instruccion,tablaDeSimbolos){
    if(instruccion.variable.tipo === TIPO_INSTRUCCION.CREAR_VARIABLE){
        procesarCreacionVariable(instruccion.variable,tablaDeSimbolos);
    }else{
        procesarAsignaciones(instruccion.variable,tablaDeSimbolos);
    }
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();

    while (condicion==="true") {
        let auxAmbito=ambito;
        nuevoAmbito();

        let regreso=procesarBloque(instruccion.sentencias,tablaDeSimbolos);
        finAmbito(auxAmbito,ambito,tablaDeSimbolos);
        if(regreso){
            return regreso;
        }
        if(instruccion.incremento.tipo === TIPO_INSTRUCCION.INCREMENTO){
            procesarIncremento(instruccion.incremento,tablaDeSimbolos);
        }else if(instruccion.incremento.tipo==TIPO_INSTRUCCION.DECREMENTO){
            procesarDecremento(instruccion.incremento,tablaDeSimbolos);
        }else{
            procesarAsignaciones(instruccion.incremento,tablaDeSimbolos);
        }
        condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
        condicion=condicion.toString();
    }
}

function procesarCrearArreglo(instruccion,tablaDeSimbolos){
    if(tablaDeSimbolos.verificarInsertarAsig(instruccion.id,ambito)){
        let datos=[];
        let tipo=instruccion.tipo_var;
        for (const dato of instruccion.datos) {
            if(puedoInsertar(dato, tipo,tablaDeSimbolos,instruccion.fila, instruccion.columna)){
                tipo=tipoDato(dato,tablaDeSimbolos);
                let registro=procesarExpresionCadena(dato);
                datos.push(registro);   
            }
        }
        tablaDeSimbolos.agregar(instruccion.acceso, instruccion.id, tipo, datos,instruccion.fila, instruccion.columna);
    }else{
        reportarError("Semantico", "La siguiente variable ya existe:<br>" + instruccion.id, instruccion.fila, instruccion.columna);
    }
}

function procesarAsignacionArreglo(instruccion,tablaDeSimbolos){
    if (!tablaDeSimbolos.verificarInsertar(instruccion.identificador)) {
        let auxVariable = tablaDeSimbolos.obtenerVariable(instruccion.identificador);
        if (puedoInsertar(instruccion.valor,auxVariable.tipo,tablaDeSimbolos,instruccion.fila, instruccion.columna)) {
            if(auxVariable.acceso!="const"&&(auxVariable.valor!="null"||auxVariable.valor!=null)){
                auxVariable.tipo=tipoDato(instruccion.valor,tablaDeSimbolos);
                let registro = procesarExpresionCadena(instruccion.valor,tablaDeSimbolos);
                let indice =   procesarExpresionCadena(instruccion.indice,tablaDeSimbolos);
                let array = auxVariable.valor;
                array[indice]=registro;
                auxVariable.valor=array;
                tablaDeSimbolos.enviarVariable(auxVariable.id,auxVariable);
            }else{
               
                reportarError("Semantico", "La variable es una constante y<br> no puede cambiar de dato ", instruccion.fila, instruccion.columna);    
            }
        }
    } else {
        reportarError("Semantico", "La siguiente variable no existe:<br>" + instruccion.identificador, instruccion.fila, instruccion.columna);
    }
}
function procesarPush(instruccion,tablaDeSimbolos){
    if (!tablaDeSimbolos.verificarInsertar(instruccion.identificador)) {

        let auxVariable = tablaDeSimbolos.obtenerVariable(instruccion.identificador);
        if (puedoInsertar(instruccion.valor,auxVariable.tipo,tablaDeSimbolos,0,0)) {
            if(auxVariable.acceso!="const"&&(auxVariable.valor!="null"||auxVariable.valor!=null)){
                auxVariable.tipo=tipoDato(instruccion.valor,tablaDeSimbolos);
                let registro = procesarExpresionCadena(instruccion.valor,tablaDeSimbolos);
                let array = auxVariable.valor;
                array.push(registro);
                auxVariable.valor=array;
                tablaDeSimbolos.enviarVariable(auxVariable.id,auxVariable);
            }else{
               
                reportarError("Semantico", "La arreglo es una constante y<br> no puede cambiar de dato ", 0, 0);    
            }
        }else {
            reportarError("Semantico", "El arreglo es de tipo: " + auxVariable.tipo+"<br>El valor es de tipo:<br>"+JSON.stringify(instruccion.valor), 0, 0);
        }

    } else {
        reportarError("Semantico", "La siguiente variable no existe para pushear algo:<br>" + instruccion.identificador, 0, 0);
    }

}

function procesarPop(expresion,tablaDeSimbolos){
    
    if (!tablaDeSimbolos.verificarInsertar(expresion.valor)) {
        let auxVariable = tablaDeSimbolos.obtenerVariable(expresion.valor);
        return auxVariable.valor.pop();
    } else {
        reportarError("Semantico", "La siguiente variable no existe para el pop:<br>" + instruccion.valor, instruccion.fila, instruccion.columna);
    }
}

function procesarForIn(expresion,tablaDeSimbolos){
    let auxiterador;
    if (!tablaDeSimbolos.verificarInsertar(expresion.iterador)) {
        auxiterador = tablaDeSimbolos.obtenerVariable(expresion.iterador);
        if(!auxiterador.tipo==="number"){
            reportarError("Semantico", "La variable ya declarada no es un numero, se convirtio en numero:<br>" + instruccion.iterador, 0, 0);
        }
        auxiterador.tipo="number";
        auxiterador.valor=0;
    } else {
        tablaDeSimbolos.agregar("let", expresion.iterador, "number", 0);
        auxiterador = tablaDeSimbolos.obtenerVariable(expresion.iterador);
    }
    let i = auxiterador.valor;
    if(!tablaDeSimbolos.verificarInsertar(expresion.arreglo)){
        let auxArreglo = tablaDeSimbolos.getLength(expresion.arreglo);

        while(i<auxArreglo-1){
            auxiterador = tablaDeSimbolos.obtenerVariable(expresion.iterador);
            i=auxiterador.valor;
            let regreso=procesarBloque(expresion.sentencias,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
            procesarIncremento(instruccionesAST.nuevoIncremento(expresion.iterador),tablaDeSimbolos);
        }
        
    }else{
        reportarError("Semantico", "El arreglo a iterar no existe:<br>" + instruccion.arreglo, 0, 0);
    }
}

function procesarForOf(expresion,tablaDeSimbolos){
    let valorIterado;
    if (!tablaDeSimbolos.verificarInsertar(expresion.iterador)) {
        valorIterado = tablaDeSimbolos.obtenerVariable(expresion.iterador);
    } else {

        tablaDeSimbolos.agregar("let", expresion.iterador, null, null);
        valorIterado = tablaDeSimbolos.obtenerVariable(expresion.iterador);
    }
   
    if(!tablaDeSimbolos.verificarInsertar(expresion.arreglo)){
        let i = 0;
        let auxArreglo = tablaDeSimbolos.getLength(expresion.arreglo);
        let array =tablaDeSimbolos.obtenerVariable(expresion.arreglo);
        valorIterado.tipo=array.tipo;
        while(i<auxArreglo){
            valorIterado.valor=array.valor[i];
            tablaDeSimbolos.enviarVariable(valorIterado.id,valorIterado);
            let regreso =procesarBloque(expresion.sentencias,tablaDeSimbolos);
            if(regreso){
                return regreso;
            }
            i++;
        }   
    }else{
        reportarError("Semantico", "El arreglo a iterar no existe:<br>" + instruccion.arreglo, 0, 0);
    }
}
/**
			tipo:TIPO_INSTRUCCION.PUSH,
			identificador:id,
			valor:dato
 */







function nuevoAmbito(){

    noAmbito++;
    ambito=ambLocal+noAmbito;
}
function finAmbito(auxAmbito,borrar,tablaDeSimbolos){
    tablaDeSimbolos.limpiar(borrar);
    --noAmbito;
    ambito=auxAmbito;
   
}
