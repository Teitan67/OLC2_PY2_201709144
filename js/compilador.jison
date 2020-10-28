%lex
%options case-sensitive
%option yylineno
%locations
%x string
%%
\s+                                                       //Omitir espacios en blanco
"//".*										              //comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			              //comentario multiple líneas
[0-9]+("."[0-9]+)?\b        return 'numero';              //Reconocimiento de numeros
"console"                   return 'console';
"log"                       return 'log';
"true"                      return 'true';
"false"                     return 'false';
\"[^"]*\"                   yytext = yytext.slice(1,-1);  return 'cadena';
\'[^']*\'                   yytext = yytext.slice(1,-1);  return 'cadena';

[N|n]"umber"                    return 'number';
"boolean"                   return 'boolean';
[S|s]"tring"                return 'string';

"function"                  return 'function';
"void"                      return 'void';
"var"                       return 'var';
"let"                       return 'let';
"const"                     return 'const';
"type"                      return 'type';
"graficar_ts"               return 'graficar_ts';
"if"                        return 'if';
"else"                      return 'else';
"while"                     return 'while';
"do"                        return 'do';
"for"                       return 'for';
"of"                        return 'of';
"in"                        return 'in';
"continue"                  return 'continue';
"break"                     return 'break';
"return"                    return 'return_';
"switch"                    return 'switch';
"case"                      return 'case';
"default"                   return 'default';
"type"                      return 'type';
"length"                    return 'length';
"pop"                       return 'pop';
"push"                      return 'push';
"CharAt"                    return 'CharAt';
"ToLowerCase"               return 'ToLowerCase';
"ToUpperCase"               return 'ToUpperCase';
"Concat"                    return 'Concat';
">="                        return 'mayorIgual';
"<="                        return 'menorIgual';
">"                         return 'mayor';
"<"                         return 'menor';


"=="                        return 'mismo';
"!="                        return 'diferente';


"&&"                        return 'and';
"||"                        return 'or';
"!"                         return 'not';
"**"                        return 'potenciar';
"?"                         return 'qEs';
"."                         return 'pt';
","                         return 'cm';
"("                         return 'pa';
")"                         return 'pc';
"+"                         return 'mas';
"*"                         return 'por';
"/"                         return 'div';
"-"                         return 'menos';
"%"                         return 'modular';
":"                         return 'dspts';
"{"                         return 'lla';
"}"                         return 'llc';
"="                         return 'igual';
"["                         return 'ca';
"]"                         return 'cc';
";"                         return 'eos';
([a-zA-Z])[a-zA-Z0-9_]*	    return 'id';
<<EOF>>                     return 'EOF';                 //End Of File
.                           {reportarError("Lexico", "Caracter no reconocido por el lenguaje <br>"+yytext, yylloc.first_column, yylloc.first_line);}
/lex

%left 'or'
%left 'and'
%left 'not'

%left 'mayor' 'mayorIgual' 'menor' 'menorIgual' 'cm'
%left 'mismo' 'diferente'

%left 'mas' 'menos'
%left 'por' 'div'
%left 'potenciar' 
%left unmenos
%left 'modular'



%start PROGRAMA

%% /* language grammar */

PROGRAMA:   
    PROGRAMA_ESTRUCTURA EOF                                { return instruccionesAST.nuevoPrograma($1);}
    
;
PROGRAMA_ESTRUCTURA:
     FUNCIONES PROGRAMA_RECOLECTADO                        {$2.unshift($1); $$=$2;}
    |PROGRAMA_RECOLECTADO                                  {$$=$1;}
;
PROGRAMA_RECOLECTADO:
     LSENTENCIAS FUNCIONES PROGRAMA_RECOLECTADO            {$3.unshift($1); $3.unshift($2); $$=$3;}
    |LSENTENCIAS                                           {$$=[$1];}
    |                                                      {$$=[];}
;

FUNCIONES:
     FUNCIONES FUNCION                                                {$1.push($2); $$ = $1;}                                    
    |FUNCION                                                          {$$=[$1];}
;

FUNCION:
     function id pa PARAMETROS pc VARIABLES_TIPO lla LSENTENCIAS  llc    {$$=instruccionesAST.nuevaFuncionCreada($2,$4,$8,this._$.first_line-1,this._$.first_column);}
    |function id pa PARAMETROS pc dspts void lla LSENTENCIAS  llc        {$$=instruccionesAST.nuevaFuncionCreada($2,$4,$9,this._$.first_line-1,this._$.first_column);}
   
;
PARAMETROS:
     PARAMETROS_ID                                                    {$$=$1;}
    |                                                                 {$$=[];}
;
PARAMETROS_ID:
     id VARIABLES_TIPO cm PARAMETROS_ID                               {$4.unshift(instruccionesAST.nuevoParametro($1,$2)); $$=$4;}
    |id VARIABLES_TIPO                                                {$$=[instruccionesAST.nuevoParametro($1,$2)];}
;
LSENTENCIAS:
     LSENTENCIAS SENTENCIAS                     { $1.push($2); $$ = $1; }
    |SENTENCIAS                                 { $$ = [$1]; }
;
SENTENCIAS:
     INST_CONSOLA                                {$$=$1;}
    |INST_CREAR_VARIABLES                        {$$=$1;}
    |INST_ASIGNAR_VARIABLES eos                  {$$=$1;}
    |INST_GRAFICADOR                             {$$=$1;}
    |INST_IF                                     {$$=$1;}
    |INST_WHILE                                  {$$=$1;}
    |INST_DO_WHILE                               {$$=$1;}
    |INST_INCREMENTO eos                         {$$=$1;}
    |INST_FOR                                    {$$=$1;}
    |INST_CREAR_ARREGLO                          {$$=$1;}
    |INST_ASIGNAR_ARREGLO                        {$$=$1;}
    |INST_PUSH                                   {$$=$1;}
    |INST_SWITCH                                 {$$=$1;}
    |INST_FOR_IN                                 {$$=$1;}
    |INST_BREAK                                  {$$=$1;}
    |INST_FOR_OF                                 {$$=$1;}
    |INST_FUNCION_LLAMADA   eos                  {$$=$1;}
    |INST_RETURN                                 {$$=$1;}
    
    |error eos                                   {$$=instruccionesAST.saltoError(); reportarError("Sintactico", "Linea mal escrita:<br>"+editor.getLine(this._$.first_line-1),this._$.first_line-1 ,this._$.first_column);}
    |error llc                                   {$$=instruccionesAST.saltoError(); reportarError("Sintactico", "Linea mal escrita:<br>"+editor.getLine(this._$.first_line-1),this._$.first_line-1 ,this._$.first_column);}
;
INST_FUNCION_LLAMADA:
     id pa  pc                                {$$=instruccionesAST.nuevaFuncionLlamada($1,[],this._$.first_line-1,this._$.first_column);}
    |id pa PARAMETRO_ENTRADA pc               {$$=instruccionesAST.nuevaFuncionLlamada($1,$3,this._$.first_line-1,this._$.first_column);}
;
PARAMETRO_ENTRADA:
     DATO cm PARAMETRO_ENTRADA      {$3.unshift($1); $$=$3;}
    |DATO                           {$$=[$1];}
;
INST_CONSOLA:
     console pt log pa IMPRESION pc eos          { $$ = instruccionesAST.nuevoImprimir($5);}
;
IMPRESION:
     IMPRESION cm IMPRESION                      { $$=instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.CONCATENACION);}
    |DATO                                        { $$=$1;}
;
DATO:
//Nuevo valores
     numero                         { $$ = instruccionesAST.nuevoValor(Number($1), TIPO_VALOR.NUMERO,this._$.first_line-1,this._$.first_column); }
    |id                             { $$ = instruccionesAST.nuevoValor($1,TIPO_VALOR.IDENTIFICADOR,this._$.first_line-1,this._$.first_column);}
    |id ca DATO cc                  { $$ = instruccionesAST.nuevoValorArreglo($1,$3, TIPO_VALOR.ARREGLO,this._$.first_line-1,this._$.first_column);}
    |cadena                         { $$ = instruccionesAST.nuevoValor($1,TIPO_VALOR.CADENA,this._$.first_line-1,this._$.first_column);}
    |false                          { $$ = instruccionesAST.nuevoValor($1,TIPO_VALOR.BOOLEANO,this._$.first_line-1,this._$.first_column);}
    |true                           { $$ = instruccionesAST.nuevoValor($1,TIPO_VALOR.BOOLEANO,this._$.first_line-1,this._$.first_columns);}

    |id pt length                   { $$ = instruccionesAST.nuevoLength($1);}
    |id pt pop pa pc                { $$ = instruccionesAST.nuevoPop($1, TIPO_VALOR.POP,this._$.first_line-1,this._$.first_column);}
    |INST_FUNCION_LLAMADA           { $$ = $1;}
    
    |id pt CharAt pa DATO pc        { $$ = instruccionesAST.nuevoCharAt(instruccionesAST.nuevoValor($1,TIPO_VALOR.IDENTIFICADOR,this._$.first_line-1,this._$.first_column),$5);}
    |id pt ToLowerCase pa pc        { $$ = instruccionesAST.nuevoToLowerCase(instruccionesAST.nuevoValor($1,TIPO_VALOR.IDENTIFICADOR,this._$.first_line-1,this._$.first_column));}
    |id pt ToUpperCase pa pc        { $$ = instruccionesAST.nuevoToUpperCase(instruccionesAST.nuevoValor($1,TIPO_VALOR.IDENTIFICADOR,this._$.first_line-1,this._$.first_column));}
    |id pt Concat pa DATO pc        { $$ = instruccionesAST.nuevoOperacionBinaria(instruccionesAST.nuevoValor($1,TIPO_VALOR.IDENTIFICADOR,this._$.first_line-1,this._$.first_column),$5,TIPO_OPERACION.CONCATENACION);}

//Aritmeticas

    |DATO mas       DATO            { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MAS);}
    |DATO menos     DATO            { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.RESTA);}
    |DATO por       DATO            { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MULTIPLICACION);}
    |DATO div       DATO            { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.DIVISION);}
    |menos DATO %prec UMENOS		{ $$ = instruccionesAST.nuevoOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
    |DATO potenciar DATO            { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.POTENCIA);}
    |DATO modular   DATO            { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MODULAR);}

    |pa DATO pc                     { $$ = $2;}

//Expresiones logicas

    |DATO and DATO                  { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.AND);}
    |DATO or DATO                   { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.OR);}
    |not DATO                       { $$ = instruccionesAST.nuevoOperacionUnaria($2,TIPO_OPERACION.NEGACION);}
    |DATO menor         DATO        { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MENOR_QUE);}
    |DATO mayor         DATO        { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MAYOR_QUE);}
    |DATO menorIgual    DATO        { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MENOR_IGUAL);}
    |DATO mayorIgual    DATO        { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.MAYOR_IGUAL);}
    |DATO mismo         DATO        { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.IGUAL);}
    |DATO diferente     DATO        { $$ = instruccionesAST.nuevoOperacionBinaria($1,$3,TIPO_OPERACION.DIFERENTE);}
;


INST_CREAR_VARIABLES:
    VARIABLES_ACCESO VARIABLES_CUERPO eos	{ $$ = instruccionesAST.nuevaVariable($1,$2); }            
;

VARIABLES_ACCESO:
     let            {$$ = $1;}
    |var            {$$ = $1;}
    |const          {$$ = $1;}
;

VARIABLES_CUERPO:
     id VARIABLES_TIPO                                                  { $$ = [ instruccionesAST.crearVariable($1,$2,null,this._$.first_line-1,this._$.first_column) ];}
    |id VARIABLES_TIPO VARIABLES_ASIGNACION                             { $$ = [ instruccionesAST.crearVariable($1,$2,$3,this._$.first_line-1,this._$.first_column) ];}
;

VARIABLES_TIPO:
    dspts TIPO_DATO                                                     { $$ = $2;}
;
TIPO_DATO:
     boolean    { $$ = $1;}
    |string     { $$ = $1;}
    |number     { $$ = $1;}
;

VARIABLES_ASIGNACION:
     igual DATO     { $$ = $2;}
;
INST_GRAFICADOR:
    graficar_ts pa pc eos   { $$ = instruccionesAST.graficar_ts(); }
;

INST_ASIGNAR_VARIABLES:
    ASIGNACION                                    { $$ = instruccionesAST.nuevasAsignaciones($1);}             
;
ASIGNACION:
     id VARIABLES_ASIGNACION                      { $$ = [instruccionesAST.nuevaAsignacion($1,$2,this._$.first_line-1,this._$.first_column)];}
    |id VARIABLES_ASIGNACION cm ASIGNACION        { $4.push(instruccionesAST.nuevaAsignacion($1,$2,this._$.first_line-1,this._$.first_column)); $$ = $4;}
;
INST_IF:
     if pa DATO pc lla LSENTENCIAS llc            { $$ = instruccionesAST.nuevoIf($3,$6,"null");}
    |if pa DATO pc lla LSENTENCIAS llc ELSE       { $$ = instruccionesAST.nuevoIf($3,$6,$8)}
;
ELSE:
     else INST_IF                                 {$$ = $2;}
    |else lla LSENTENCIAS llc                     {$$ = instruccionesAST.nuevoElse($3);}
;

INST_WHILE:
    while pa DATO pc lla LSENTENCIAS llc          { $$ = instruccionesAST.nuevoWhile($3,$6);}
;

INST_DO_WHILE:
    do lla LSENTENCIAS llc while pa DATO pc       { $$ = instruccionesAST.nuevoDoWhile($7,$3);}
;

INST_INCREMENTO: 
     id mas mas                                   { $$ = instruccionesAST.nuevoIncremento($1);}
    |id menos menos                               { $$ = instruccionesAST.nuevoDecremento($1);}
;
INST_FOR:
    for pa FOR_ASIGNACION   DATO eos FOR_AUMENTO pc lla LSENTENCIAS llc   {$$ = instruccionesAST.nuevoFor($3,$4,$6,$9);}
;
FOR_ASIGNACION:
     INST_CREAR_VARIABLES           {$$=$1;}
    |INST_ASIGNAR_VARIABLES eos     {$$=$1;}
;
FOR_AUMENTO:
     INST_INCREMENTO            {$$=$1;}
    |INST_ASIGNAR_VARIABLES     {$$=$1;}
;

INST_CREAR_ARREGLO:
     VARIABLES_ACCESO id VARIABLES_TIPO ca cc  eos                                {$$=instruccionesAST.nuevoArreglo($1,$2,$3,[],this._$.first_line-1,this._$.first_column);}
    |VARIABLES_ACCESO id VARIABLES_TIPO ca cc  igual ca ARREGLO_DATOS cc eos      {$$=instruccionesAST.nuevoArreglo($1,$2,$3,$8,this._$.first_line-1,this._$.first_column);}
;

ARREGLO_DATOS:
     DATO cm ARREGLO_DATOS  { $3.unshift($1); $$ = $3;}
    |DATO                   { $$ = [$1];}
;

INST_ASIGNAR_ARREGLO:
    id ca DATO cc igual DATO eos    { $$ = instruccionesAST.nuevaAsignacionArreglo($1,$3,$6,this._$.first_line-1,this._$.first_column);}
;

INST_PUSH:
    id pt push pa DATO pc eos               { $$ = instruccionesAST.nuevoPush($1,$5);}
;
INST_FOR_IN :
    for pa FOR_IN_ASIGNACION in id pc lla LSENTENCIAS llc           { $$ =instruccionesAST.nuevoForIn($3,$5,$8) ;}
;
FOR_IN_ASIGNACION:
     VARIABLES_ACCESO id        { $$ = $2;}
    |id                         { $$ = $1;}
;   
INST_FOR_OF :
    for pa FOR_IN_ASIGNACION of id pc lla LSENTENCIAS llc           { $$ =instruccionesAST.nuevoForOf($3,$5,$8) ;}
;
INST_RETURN:
     return_ DATO eos               {$$=instruccionesAST.nuevoReturn($2);}
    |return_  eos                   {$$=instruccionesAST.nuevoReturn(null);}
;
INST_BREAK:
    break eos  {$$=instruccionesAST.nuevoBreak();}
;
INST_SWITCH:
    switch pa DATO pc lla SWITCH_CUERPO llc {$$=instruccionesAST.nuevoSwitch($DATO,$SWITCH_CUERPO);}
;
SWITCH_CUERPO:
     case DATO dspts LSENTENCIAS SWITCH_CUERPO          {$5.unshift(instruccionesAST.nuevoCase($2,$4));$$=$5;}
    |case DATO dspts LSENTENCIAS SWITCH_DEFAUTL         {$5.unshift(instruccionesAST.nuevoCase($2,$4));$$=$5;}
    |case DATO dspts LSENTENCIAS                        {$$=[instruccionesAST.nuevoCase($DATO,$LSENTENCIAS)];}
;
SWITCH_DEFAUTL:
     default dspts LSENTENCIAS                          {$$=[instruccionesAST.nuevoCase(instruccionesAST.nuevoValor($1,TIPO_VALOR.CADENA),$LSENTENCIAS)];} 
;