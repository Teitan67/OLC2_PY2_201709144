const ambGlobal="global";
const ambLocal ="local_";

let noAmbito=0;
let ambito = ambGlobal;



const TIPO_DATO = {
    NUMERO: 'NUMBER',
    BOOL:   'BOOLEANO',
    CADENA: 'STRING'
}


function crearSimbolo(acceso,id, tipo, valor,fila,columna) {
    return {
        acceso:acceso,
        id: id,
        tipo: tipo,
        valor: valor,
        ambito:ambito,
        fila:fila,
        columna:columna
    }
}

class TS {


    constructor (simbolos) {
        this._simbolos = simbolos;
    }

    agregar(acceso,id, tipo, valor,fila,columna) {
        const nuevoSimbolo = crearSimbolo(acceso,id, tipo, valor,fila,columna);
        this._simbolos.unshift(nuevoSimbolo);
    }

    actualizar(id, valor) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) simbolo.valor = valor;
        else reportarError("Semantico", "La siguiente variable no existe:<br>"+id, 0, 0);
    }

    obtener(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];

        if (simbolo) return simbolo.valor;
        else reportarError("Semantico", "La siguiente variable no existe:<br>"+id, 0, 0);
    }
    verificarInsertarAsig(id,auxAmbito) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id&&auxAmbito===simbolo.ambito)[0];
        if (simbolo){
            return false
        }else {
            return true;
        }
    }

    verificarInsertar(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo){
            return false
        }else {
            return true;
        }
    }

    obtenerTipo(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];

        if (simbolo) return simbolo.tipo;
        else reportarError("Semantico", "La siguiente variable no existe:<br>"+id, 0, 0); return null;
    }
    obtenerVariable(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) return simbolo;
        else reportarError("Semantico", "La siguiente variable no existe:<br>"+id, 0, 0);
    }

    enviarVariable(id,sim) {
        let simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) simbolo = sim;
        else reportarError("Semantico", "La siguiente variable no existe:<br>"+id, 0, 0);
    }

    get simbolos() {
        return this._simbolos;
    }

    getLength(id){
        let sim=this.obtenerVariable(id);
        let valores=sim.valor;
    //  console.log(valores.length);
        return valores.length;
    }
    limpiar(ambito_entrada) { 
        var tabla = [];

        this._simbolos.filter(function(simbolo){ 
            if(simbolo.ambito !== ambito_entrada){
                tabla.push(simbolo)
            }
        })[0];
        
        this._simbolos=tabla;
    }
}

//Funciones
const TIPO_FUNCION = {
    VOID:   'VOID',
    NUMERO: 'NUMBER',
    BOOL:   'BOOLEANO',
    CADENA: 'STRING'
}



 let funcionesTabla = [];

 function obtenerFuncion(id){
    let funcion_tab = funcionesTabla;
    for (const funcion of funcion_tab) {

        if(funcion.identificador==id){
            return funcion
        }
    }
    return null
 }

 let pilaReturn = [];