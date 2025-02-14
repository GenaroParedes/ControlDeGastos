import { formulario } from "./selectores.js";
import { preguntarPresupuesto, agregarGasto } from "./funciones.js";

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto)
}


