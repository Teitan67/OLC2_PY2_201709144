%lex
%options case-sensitive
%option yylineno
%locations
%x string
%%


"\r"                        return 'retorno';

"\""                        return 'comilla';
"\t"                        return 'tabular';
"\n"                        return 'salto';
"\\"                        return 'barra';
[^\t\\\n\r]                       return 'simbolo';
<<EOF>>                     return 'EOF';                 //End Of File
/lex


%start inicio

%% /* language grammar */

inicio:   
    cadena EOF                {return $1;}
;
cadena:
     simbolo cadena            {$$=$1+$2;}
    |tabular cadena            {$$="    "+$2;}
    |salto   cadena            {$$="\n"+$2;}
    |comilla cadena            {$$="\""+$2;}
    |barra   cadena            {$$=String.fromCharCode(47)+$2;}
    |retorno cadena            {$$="\r"+$2;}
    |                          {$$="";}
;