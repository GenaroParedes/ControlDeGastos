import {ui} from './variables.js';
import { Prespuesto } from './classes/Presupuesto.js';
import { formulario } from './selectores.js';
let presupuesto;
//Funciones
export function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");
    //isNaN(presupuestoUsuario) si el usuario ingresa una letra nos devuelve NaN, por lo tanto, con esto evitamos que el usuario ingrese letras
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0)
        {
        window.location.reload(); //Esto recarga la pagina cada vez que el usuario no ingrese nada
    }

    //Si pasa la validacion tenemos un presupuesto válido
    presupuesto = new Prespuesto(presupuestoUsuario);
    //Insertamos el presupuesto al HTML
    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
export function agregarGasto(e){
    e.preventDefault(); //Cada vez que tengamos un submit, prevenimos la accion sino al enviar el form, no podemos hacer mas nada
    //TOMAMOS LOS VALORES DE LOS CAMPOS DONDE INGRESA EL USUARIO
    const nombreGasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value); //Lo convertimos en numero
    
    //Validar
    if(nombreGasto === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return; //Si hay un error retornamos para que no ejecute lo que viene debajo
    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Gastos no válidos', 'error');
        return; //Si hay un error retornamos para que no ejecute lo que viene debajo
    }

    //Si pasa las validaciones, es porque se puede agregar un nuevo gasto
    const gasto = {
        nombreGasto, //nombreGasto: nombreGasto
        cantidad,   //cantidad: cantidad - es lo mismo
        id: Date.now()
    }
    
    presupuesto.nuevoGasto(gasto); //Paso el nuevo gasto
    //Mensaje que se ejecutó todo bien
    ui.imprimirAlerta('Correcto', '');
    //Imprimir los gastos
    const {gastos, restante} = presupuesto; //Mejor que pasar todo el objeto
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto); //Aca paso el objeto porque vamos a necesitar el presupuesto y el restante que son propiedades del objeto
    //Reinicio el formulario
    formulario.reset();

}

export function eliminarGasto(id){
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}