// Procesamos las instrucciones reconocidas en nuestro AST

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
    instrucciones.forEach(instruccion => {

        if (instruccion.tipo === TIPO_INSTRUCCION.IMPRIMIR) {
            // Procesando Instrucción Imprimir
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
            procesarIf(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.WHILE){
            procesarWhile(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.DO_WHILE){
            procesarDoWhile(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.INCREMENTO){
            procesarIncremento(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.DECREMENTO){
            procesarDecremento(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.FOR){
            procesarFor(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.CREAR_ARREGLO){
            procesarCrearArreglo(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo==TIPO_INSTRUCCION.ASIGNAR_ARREGLO){
            procesarAsignacionArreglo(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.PUSH){
            procesarPush(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.FOR_IN){
            procesarForIn(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.FOR_OF){
            procesarForOf(instruccion,tablaDeSimbolos);
        }else if(instruccion.tipo===TIPO_INSTRUCCION.FUNCION_LLAMAR){
            procesarFuncion(instruccion,tablaDeSimbolos);
        }else {
            console.error('ERROR: tipo de instrucción no válido: ' + JSON.stringify(instruccion));
        }
    });
}
function procesarFuncion(instruccion,tablaDeSimbolos){
    //console.log(funcionesTabla);
    let funcion=obtenerFuncion(instruccion.identificador);
    
    if(funcion!==null){
        let auxAmbito=ambito;
        nuevoAmbito();
        let parametros_entrada=instruccion.parametros;
        let parametros_funcion=funcion.parametros;
        let variables_locales=[];
        let auxVarianle=null;
        if (parametros_entrada.length==parametros_funcion.length){
            for (const i in parametros_entrada) {
                auxVarianle=parametros_funcion[i];
                console.log(parametros_entrada[i]);
                variables_locales.unshift(instruccionesAST.crearVariable(auxVarianle.identificador,auxVarianle.tipo_Var,parametros_entrada[i]));
            }
            let ast_parametro=instruccionesAST.nuevaVariable("let",variables_locales);
            procesarCreacionVariable(ast_parametro, tablaDeSimbolos);
            procesarBloque(funcion.sentencias,tablaDeSimbolos);
            finAmbito(auxAmbito,ambito,tablaDeSimbolos);  
        }else{
            reportarError("Semantico", "La siguiente funcion "+instruccion.identificador+"<br> tiene un numero de parametros invalidos" , 0, 0); 
        }
 
    }else{
        reportarError("Semantico", "La siguiente funcion "+instruccion.identificador+"<br> no existe" , 0, 0); 
    }
}

function procesarCreacionVariable(instruccion, tablaDeSimbolos) {
    let acceso = instruccion.acceso;

    for (let variable of instruccion.variables) {
        if (tablaDeSimbolos.verificarInsertarAsig(variable.identificador,ambito)) {
            if (puedoInsertar(variable.valor, variable.tipo_var,tablaDeSimbolos)) {
                if (variable.tipo === TIPO_OPERACION.CREAR_VAR) {
                    let val = null;
                    let tipo_var = variable.tipo_var;
                    if (variable.valor) {
                        tipo_var = tipoDato(variable.valor,tablaDeSimbolos);
                        val = procesarExpresionCadena(variable.valor, tablaDeSimbolos);
                    }
                    tablaDeSimbolos.agregar(acceso, variable.identificador, tipo_var, val);
                } else {
                    console.error("Operacion sin sentido dentro del AST " + variable);
                }
            }else{
                reportarError("Semantico", "La siguiente variable "+JSON.stringify(variable.valor.valor)+"<br> no acepta tipos de datos<br> que se intentan insertar" , 0, 0);
            }
        } else {
            reportarError("Semantico", "La siguiente variable ya existe:<br>" + variable.identificador, 0, 0);
        }
    }
}

function procesarImprimir(instruccion, tablaDeSimbolos) {
    const cadena = procesarExpresionCadena(instruccion.expresionCadena, tablaDeSimbolos);
    consolAdd(cadena);
}

function procesarExpresionCadena(expresion, tablaDeSimbolos) {

    if (expresion.tipo === TIPO_OPERACION.CONCATENACION) {

        const cadIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        const cadDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
        return cadIzq.toString() + cadDer.toString();
    } else if (expresion.tipo === TIPO_VALOR.CADENA) {
        var val = parseCadena.parse(expresion.valor);
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
                reportarError("Semantico", "El tamaño del arreglo: "+valores.length+" es menor o igual al indice colocado: " + indice, 0, 0);
                return 0;
            } 
        } else {
            reportarError("Semantico", "No es de tipo booleano esta variable:<br>" + expresion.valor, 0, 0);
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
                reportarError("Semantico", "El tamaño del arreglo: "+valores.length+" es menor o igual al indice colocado: " + indice, 0, 0);
                return 0;
            } 
        } else {
            reportarError("Semantico", "No es de tipo STRING esta variable:<br>" + expresion.valor, 0, 0);
        }
    }else {
        console.error("Instruccion no reconocida: " + JSON.stringify(expresion));
    }
}

function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
    
    if (expresion.tipo === TIPO_VALOR.NUMERO) {
        return expresion.valor;
    } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        //console.log(JSON.stringify(expresion));
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

        const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
        return valor * valor;
    }else if (expresion.tipo === TIPO_OPERACION.MODULAR) {

        const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.
        return valorIzq % valorDer;
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

    if (expresion.tipo === TIPO_OPERACION.IGUAL) return valorIzq == valorDer;
    if (expresion.tipo === TIPO_OPERACION.DIFERENTE) return valorIzq != valorDer;

}

function procesarExpresionComparativa(expresion, tablaDeSimbolos) {

    if (expresion.tipo === TIPO_OPERACION.NEGACION) {

        const valor = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);     // resolvemos el operando
        return !valor;

    } else {
        const valorIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos);      // resolvemos el operando izquierdo.
        const valorDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos);      // resolvemos el operando derecho.

        if (expresion.tipo === TIPO_OPERACION.AND) return valorIzq && valorDer;
        if (expresion.tipo === TIPO_OPERACION.OR) return valorIzq || valorDer;
    }
}

function graficar(tablaDeSimbolos) {
    limpiarAmb();
    for (const variable of tablaDeSimbolos._simbolos) {
        addVariable(variable.id, variable.tipo, variable.ambito);
    }
}


function puedoInsertar(expresion, tipo,tablaDeSimbolos) {
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
        return tipo===tablaDeSimbolos.obtenerTipo(expresion.valor);
    } else if(expresion.tipo == TIPO_VALOR.LENGTH&& tipo === "number"){
        return true;
    } else {
        reportarError("Semantico", "No coinciden los datos:<br>" + "La variable es de tipo " + tipo + "<br>El valor es de tipo:<br>" + JSON.stringify(expresion.tipo), 0, 0);
        return false;
    }
}
//mimir
function tipoDato(expresion,tablaDeSimbolos) {
    if (expresion === null) {
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
    } else if ((expresion.tipo == TIPO_OPERACION.AND || expresion.tipo === TIPO_OPERACION.OR || expresion.tipo === TIPO_OPERACION.NEGACION) && tipo === "boolean") {
        return "boolean";
    }else if(expresion.tipo == TIPO_VALOR.IDENTIFICADOR||expresion.tipo == TIPO_VALOR.ARREGLO||expresion.tipo == TIPO_VALOR.POP){
        return tablaDeSimbolos.obtenerTipo(expresion.valor);
    } else if(expresion.tipo == TIPO_VALOR.LENGTH){
        return "number";
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
    const tsIf = new TS(tablaDeSimbolos.simbolos);
    let auxAmbito=ambito;
    nuevoAmbito();
    if(condicion==="true"){
        procesarBloque(instruccion.sentencias,tablaDeSimbolos);
    }else{
        if(instruccion.elseIf!="null"){
            if(instruccion.elseIf.tipo==TIPO_INSTRUCCION.ELSE){
                procesarBloque(instruccion.elseIf.sentencias);
            }else{
                procesarIf(instruccion.elseIf,tablaDeSimbolos);
            }
            
        }
    }
    finAmbito(auxAmbito,ambito,tablaDeSimbolos);
}

function procesarAsignaciones(instruccion, tablaDeSimbolos) {
    for (let variable of instruccion.asignacion) {
        if (!tablaDeSimbolos.verificarInsertar(variable.identificador)) {
            let auxVariable = tablaDeSimbolos.obtenerVariable(variable.identificador);
            if (puedoInsertar(variable.valor,auxVariable.tipo,tablaDeSimbolos)) {
                if(auxVariable.acceso!="const"&&(auxVariable.valor!="null"||auxVariable.valor!=null)){
                    auxVariable.tipo=tipoDato(variable.valor,tablaDeSimbolos);
                    auxVariable.valor = procesarExpresionCadena(variable.valor,tablaDeSimbolos);
                    //console.log(JSON.stringify(variable));
                    tablaDeSimbolos.enviarVariable(auxVariable.id,auxVariable);
                }else{
                    console.log(auxVariable.valor!=="null"||auxVariable.valor!==null,auxVariable.acceso);
                    reportarError("Semantico", "La variable es una constante y<br> no puede cambiar de dato ", 0, 0);    
                }
            }else {
                reportarError("Semantico", "La variable es de tipo: " + auxVariable.tipo+"<br>El valor es de tipo:<br>"+JSON.stringify(variable.valor), 0, 0);
            }
        } else {
            reportarError("Semantico", "La siguiente variable ya existe:<br>" + variable.identificador, 0, 0);
        }
    }
}

function procesarWhile(instruccion,tablaDeSimbolos){
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();
    let tsWhl = new TS(tablaDeSimbolos.simbolos);
    let auxAmbito=ambito;
    nuevoAmbito();
    while (condicion==="true") {
        procesarBloque(instruccion.sentencias,tablaDeSimbolos);
        condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
        condicion=condicion.toString();
    }
    finAmbito(auxAmbito,ambito,tablaDeSimbolos);
}

function procesarDoWhile(instruccion,tablaDeSimbolos){
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();
    let tsDoWhl = new TS(tablaDeSimbolos.simbolos);
    let auxAmbito=ambito;
    nuevoAmbito();
    do{
        procesarBloque(instruccion.sentencias,tablaDeSimbolos);
        condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
        condicion=condicion.toString();

    }while (condicion==="true")
    finAmbito(auxAmbito,ambito,tablaDeSimbolos);
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

    let tsFor = new TS(tablaDeSimbolos.simbolos);
    let auxAmbito=ambito;
    nuevoAmbito();

    if(instruccion.variable.tipo === TIPO_INSTRUCCION.CREAR_VARIABLE){
        procesarCreacionVariable(instruccion.variable,tablaDeSimbolos);
    }else{
        procesarAsignaciones(instruccion.variable,tablaDeSimbolos);
    }
    let condicion = procesarExpresionCadena(instruccion.condicion,tablaDeSimbolos);
    condicion=condicion.toString();

    while (condicion==="true") {
        procesarBloque(instruccion.sentencias,tablaDeSimbolos);

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
    finAmbito(auxAmbito,ambito,tablaDeSimbolos);

}

function procesarCrearArreglo(instruccion,tablaDeSimbolos){
    if(tablaDeSimbolos.verificarInsertarAsig(instruccion.id,ambito)){
        let datos=[];
        let tipo;
        for (const dato of instruccion.datos) {
            if(puedoInsertar(dato, instruccion.tipo_var,tablaDeSimbolos)){
                tipo=tipoDato(dato,tablaDeSimbolos);
                let registro=procesarExpresionCadena(dato);
                datos.unshift(registro);   
            }else{
                reportarError("Semantico", "No coinciden los datos:<br>" + "La variable es de tipo " + instruccion.tipo_var + "<br>El valor es de tipo:<br> " + JSON.stringify(dato.tipo), 0, 0);
            }
        }
        tablaDeSimbolos.agregar(instruccion.acceso, instruccion.id, tipo, datos);
    }else{
        reportarError("Semantico", "La siguiente variable ya existe:<br>" + instruccion.id, 0, 0);
    }
}

function procesarAsignacionArreglo(instruccion,tablaDeSimbolos){
    if (!tablaDeSimbolos.verificarInsertar(instruccion.identificador)) {
        let auxVariable = tablaDeSimbolos.obtenerVariable(instruccion.identificador);
        if (puedoInsertar(instruccion.valor,auxVariable.tipo,tablaDeSimbolos)) {
            if(auxVariable.acceso!="const"&&(auxVariable.valor!="null"||auxVariable.valor!=null)){
                auxVariable.tipo=tipoDato(instruccion.valor,tablaDeSimbolos);
                let registro = procesarExpresionCadena(instruccion.valor,tablaDeSimbolos);
                let indice =   procesarExpresionCadena(instruccion.indice,tablaDeSimbolos);
                let array = auxVariable.valor;
                array[indice]=registro;
                auxVariable.valor=array;
                tablaDeSimbolos.enviarVariable(auxVariable.id,auxVariable);
            }else{
               
                reportarError("Semantico", "La variable es una constante y<br> no puede cambiar de dato ", 0, 0);    
            }
        }else {
            reportarError("Semantico", "La variable es de tipo: " + auxVariable.tipo+"<br>El valor es de tipo:<br>"+JSON.stringify(instruccion.valor), 0, 0);
        }
    } else {
        reportarError("Semantico", "La siguiente variable no existe:<br>" + instruccion.identificador, 0, 0);
    }
}
function procesarPush(instruccion,tablaDeSimbolos){
    if (!tablaDeSimbolos.verificarInsertar(instruccion.identificador)) {

        let auxVariable = tablaDeSimbolos.obtenerVariable(instruccion.identificador);
        if (puedoInsertar(instruccion.valor,auxVariable.tipo,tablaDeSimbolos)) {
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
        reportarError("Semantico", "La siguiente variable no existe para pop algo:<br>" + instruccion.identificador, 0, 0);
    }
}

function procesarForIn(expresion,tablaDeSimbolos){
    let auxiterador;
    let auxAmbito=ambito;
    nuevoAmbito();
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
            procesarBloque(expresion.sentencias,tablaDeSimbolos);
            procesarIncremento(instruccionesAST.nuevoIncremento(expresion.iterador),tablaDeSimbolos);
        }
        finAmbito(auxAmbito,ambito,tablaDeSimbolos);
    }else{
        reportarError("Semantico", "El arreglo a iterar no existe:<br>" + instruccion.arreglo, 0, 0);
    }
}

function procesarForOf(expresion,tablaDeSimbolos){
    let auxAmbito=ambito;
    nuevoAmbito();
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
            procesarBloque(expresion.sentencias,tablaDeSimbolos);
            i++;
        }
        finAmbito(auxAmbito,ambito,tablaDeSimbolos);   
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
 //   console.log(ambito);
    noAmbito++;
    ambito=ambLocal+noAmbito;
}
function finAmbito(auxAmbito,borrar,tablaDeSimbolos){
    tablaDeSimbolos.limpiar(borrar);
    noAmbito--;
    ambito=auxAmbito;
   // console.log(ambito);
}
