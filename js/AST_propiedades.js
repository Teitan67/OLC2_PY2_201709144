//Nommbre de los atributo en el AST
// Constantes para los tipos de 'valores' que reconoce nuestra gramática.
const TIPO_VALOR = {
	NUMERO:        'VAL_NUMERO',
	IDENTIFICADOR: 'VAL_IDENTIFICADOR',
    CADENA:        'VAL_CADENA',
	BOOLEANO:      'VAL_BOOLEANO',
	LLAMADO:	   'VAL_LLAMADO',
	ARREGLO:       'VAL_ARREGLO',
	ATRIBUTO:	   'VAL_ATRIBUTO',
	LENGTH: 	   'VAL_LENGTH',
	POP:		   'VAL_POP',
	PARAMETRO:	   'VAL_PARAMETRO',
	CHAR_AT: 	   'VAL_CHAR_AT',
	LowerCase:	   'VAL_nuevoToLowerCase',
	UpperCase:	   'VAL_nuevoToUpperCase'
}	

// Constantes para los tipos de 'operaciones' que soporta nuestra gramática.
const TIPO_OPERACION = {
	SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
	DIVISION:       'OP_DIVISION',
	NEGATIVO:       'OP_NEGATIVO',
	POTENCIA:		'OP_POTENCIA',
	MODULAR:		'OP_MODULAR',
	MAS:			'OP_MAS',
	MAYOR_QUE:      'OP_MAYOR_QUE',
	MENOR_QUE:      'OP_MENOR_QUE',
	MAYOR_IGUAL:    'OP_MAYOR_IGUAL',
	MENOR_IGUAL:	'OP_MENOR_IGUAL',
	IGUAL:			'OP_IGUAL',
	DIFERENTE:		'OP_DIFERENTE',
	NEGACION:  		'OP_NEGACION',
	AND:			'OP_AND',
	OR:				'OP_OR',
    
	CONCATENACION:  'OP_CONCATENACION',
	CREAR_VAR:		'OP_CREAR_VARIABLE',
	ASIGNAR_VAR:	'OP_ASIGNA_VARIABLE'
	
};

// Constantes para los tipos de 'instrucciones' válidas en nuestra gramática.
const TIPO_INSTRUCCION = {
	IMPRIMIR:    		'INSTR_IMPRIMIR',
	DECLARACION: 		'INSTR_DECLARACION',
	ASIGNACION:  		'INSTR_ASIGANCION',
	IF:          		'INSTR_IF',

	ERROR:		 		'INSTR_RECUPERACION',
	CREAR_VARIABLE:     'INSTR_CREAR_VARIABLE',
	GRAFICAR:			'INSTR_GRAFICAR',
	ELSE:				'INSTR_ELSE',
	WHILE:			    'INSTR_WHILE',
	DO_WHILE:			'INSTR_DO_WHILE',
	INCREMENTO:			'INSTR_INCREMENTO',
	FOR:				'INSTR_FOR',
	DECREMENTO:			'INSTR_DECREMENTO',
	CREAR_ARREGLO:   	'INSTR_CREAR_ARREGLO',
	ASIGNAR_ARREGLO:	'INSTR_ASIGNAR_ARREGLO',
	PUSH:				'INSTR_PUSH',
	FOR_IN:				'INSTR_FOR_IN',
	FOR_OF:				'INSTR_FOR_OF',
	FUNCION_NUEVA:    	'INSTR_FUNCION_NUEVA',
	FUNCION_LLAMAR:		'INSTR_FUNCION_LLAMADA',
	RETURN:				'INSTR_RETURN',
	BREAK:				'INSTR_BREAK',
	SWITCH:				'INSTR_SWITCH'
}

//Operacion generica
function nuevaOperacion(operandoIzq, operandoDer, tipo) {
	return {
		operandoIzq: operandoIzq,
		operandoDer: operandoDer,
		tipo: tipo
	}
}

const instruccionesAST = {

	/**
	 * Crea un nuevo objeto tipo Operación para las operaciones binarias válidas.
	 */
	nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
		return nuevaOperacion(operandoIzq, operandoDer, tipo);
	},

	/**
	 * Crea un nuevo objeto tipo Operación para las operaciones unarias válidas
	 */
	nuevoOperacionUnaria: function(operando, tipo) {
		return nuevaOperacion(operando, undefined, tipo);
	},

	/**
	 * Crea un nuevo objeto tipo Valor, esto puede ser una cadena, un número o un identificador
	 */
	nuevoValor: function(valor, tipo,fila,columna) {
		return {
			tipo: tipo,
			valor: valor
		}
	},
	nuevoValorArreglo: function(valor,indice, tipo,fila,columna) {
		return {
			tipo: tipo,
			indice:indice,
			valor: valor,
			fila:fila,
			columna:columna
		}
	},

	/**
	 * Crea un objeto tipo Instrucción para la sentencia Imprimir.
	 */
	nuevoImprimir: function(expresionCadena) {
		return {
			tipo: TIPO_INSTRUCCION.IMPRIMIR,
			expresionCadena: expresionCadena
		};
	},
	nuevaAsignacionArreglo:function(id,indice,valor,fila,columna){
		return{
			tipo:TIPO_INSTRUCCION.ASIGNAR_ARREGLO,
			identificador:id,
			indice:indice,
			valor:valor,
			fila:fila,
			columna:columna
		}
	},
	/**
	 * Crea un objeto tipo Instrucción para la sentencia If.
	 */
	saltoError: function() {
		return {
			tipo: TIPO_INSTRUCCION.ERROR,
		}
	},

	crearVariable:function(id,tipo,valor,fila,columna){
		return{
			tipo: TIPO_OPERACION.CREAR_VAR,
			identificador:id,
			tipo_var:tipo,
			valor:valor,
			fila:fila,
			columna:columna
		}
	},
	nuevaVariable:function(acceso,variables){
		return{
			tipo:TIPO_INSTRUCCION.CREAR_VARIABLE,
			acceso: acceso,
			variables: variables
		}
	},
	nuevasAsignaciones:function(asignaciones){
		return{
			tipo: TIPO_INSTRUCCION.ASIGNACION,
			asignacion:asignaciones
		}
	},
	nuevaAsignacion:function(id,valor,fila,columna){
		return{
			tipo: TIPO_OPERACION.ASIGNAR_VAR,
			identificador:id,
			valor:valor,
			fila:fila,
			columna:columna
		}
	},
	graficar_ts:function(){
		return{
			tipo:TIPO_INSTRUCCION.GRAFICAR
		}
	},
	nuevoIf:function(condicion,sentencias,elseIf){
		return{
			tipo:TIPO_INSTRUCCION.IF,
			condicion:condicion,
			sentencias:sentencias,
			elseIf: elseIf
		}
	},
	nuevoElse:function(sentencias){
		return{
			tipo:TIPO_INSTRUCCION.ELSE,
			sentencias:sentencias
		}
	},
	nuevoWhile:function(condicion,sentencias){
		return{
			tipo:TIPO_INSTRUCCION.WHILE,
			condicion: condicion,
			sentencias:sentencias
		}

	},
	nuevoDoWhile:function(condicion,sentencias){
		return{
			tipo: TIPO_INSTRUCCION.DO_WHILE,
			condicion:condicion,
			sentencias:sentencias
		}
	},
	nuevoIncremento:function(id){
		return{
			tipo: TIPO_INSTRUCCION.INCREMENTO,
			identificador: id
		}
	},
	nuevoDecremento:function(id){
		return{
			tipo: TIPO_INSTRUCCION.DECREMENTO,
			identificador: id
		}
	},
	nuevoFor:function(variable,condicion,incremento,sentencias){
		return{
			tipo: TIPO_INSTRUCCION.FOR,
			variable: variable,
			condicion: condicion,
			incremento:incremento,
			sentencias:sentencias
		}
	},
	nuevoArreglo:function(acceso,id,tipo_Var,datos,fila,columna){
		return{
			tipo: TIPO_INSTRUCCION.CREAR_ARREGLO,
			acceso:acceso,
			id: id,
			tipo_var:tipo_Var,
			datos:datos,
			fila:fila,
			columna:columna
		}
	},
	nuevoLength:function(id){
		return{
			tipo: TIPO_VALOR.LENGTH,
			identificador:id
		}
	},
	nuevoPush:function(id,dato){
		return{
			tipo:TIPO_INSTRUCCION.PUSH,
			identificador:id,
			valor:dato
		}
	},
	nuevoPop:function(id,tipo,fila,columna){
		return{
			tipo: tipo,
			valor:id,
			fila:fila,
			columna:columna
		}
	},
	nuevoForIn:function(iterador,arreglo,sentencias){
		return{
			tipo:TIPO_INSTRUCCION.FOR_IN,
			iterador:iterador,
			arreglo:arreglo,
			sentencias:sentencias
		}
	},
	nuevoForOf:function(iterador,arreglo,sentencias){
		return{
			tipo:TIPO_INSTRUCCION.FOR_OF,
			iterador:iterador,
			arreglo:arreglo,
			sentencias:sentencias
		}
	},
	nuevaFuncionCreada:function(id,parametros,sentencias,linea,columna) {
		return{
			tipo:TIPO_INSTRUCCION.FUNCION_NUEVA,
			identificador:id,
			parametros:parametros,
			sentencias:sentencias,
			fila:linea,
			columna:columna
		}
	},
	nuevaFuncionLlamada:function(id,parametros,fila,columna){
		return{
			tipo:TIPO_INSTRUCCION.FUNCION_LLAMAR,
			identificador:id,
			parametros:parametros,
			fila:fila,
			columna:columna
		}
	},
	nuevoPrograma:function(programa){
		return{
			programa:programa
			
		}
	},
	nuevoParametro:function(id,tipo_Var){
		return{
			tipo:TIPO_VALOR.PARAMETRO,
			identificador:id,
			tipo_Var:tipo_Var
		}
	},
	nuevoBreak:function(){
		return{
			tipo:TIPO_INSTRUCCION.BREAK
		}
	},
	nuevoSwitch:function(comparando,casos){
		return{
			tipo:TIPO_INSTRUCCION.SWITCH,
			comparando:comparando,
			casos:casos
		}
	},
	nuevoCase:function(comparador,sentencias){
		return{
			comparador:comparador,
			sentencias:sentencias
		}
	},
	nuevoCharAt:function(id,indice){
		return{
			tipo:TIPO_VALOR.CHAR_AT,
			identificador:id,
			indice:indice
		}
	},
	nuevoToLowerCase:function(cadena){
		return{
			tipo:TIPO_VALOR.LowerCase,
			cadena:cadena
		}
	},
	nuevoToUpperCase:function(cadena){
		return{
			tipo:TIPO_VALOR.UpperCase,
			cadena:cadena
		}
	},
	nuevoReturn:function(regreso){
		return{
			tipo:TIPO_INSTRUCCION.RETURN,
			regreso:regreso
		}
	}
}