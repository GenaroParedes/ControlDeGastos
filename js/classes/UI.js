import {listadoGasto, formulario} from '../selectores.js';
import { eliminarGasto } from '../funciones.js';

export class UI {
    insertarPresupuesto(presupuestoObj){
        //Extrayendo valores
        const {presupuesto, restante} = presupuestoObj;
        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert') //Utiliza Bootstrap
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger'); //Bootstrap a traves de alert-danger nos devuelve una alerta en rojo
        } else {
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar luego de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos){
        this.limpiarHTML()
        gastos.forEach(gasto => {
            const {nombreGasto, cantidad, id} = gasto;
            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; //Agrego clases de bootstrap al li
            nuevoGasto.dataset.id = id; //nuevoGasto.setAttribute('data-id', id) - hacen lo mismo
            
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombreGasto}<span class="badge badge-primary badge-pill"> $${cantidad}</span>`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borar-gasto');
            btnBorrar.textContent = 'Borrar x';
            btnBorrar.onclick = () => { //Para que no llame a la funcion directamente sino cuando se da click en ese boton, 
                //tenemos que utilizar un arrowfunction y despues pasarle el parametro a la funcion.
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            
            //Agregar al HTML
            listadoGasto.appendChild(nuevoGasto);
        })
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if(restante < (presupuesto * 0.25)){
            restanteDiv.classList.remove('alert-success', 'alert-warning'); //Por si antes habia pasado por la alerta de warning
            restanteDiv.classList.add('alert-danger');
        } else if(restante < (presupuesto * 0.50)){
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
        //Si el presupuesto se acabara
        if(restante <= 0){
            this.imprimirAlerta('El presupuesto se ha agotado', 'error');
            //Desabilito el boton del formulario
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }

    limpiarHTML(){
        while(listadoGasto.firstChild){
            listadoGasto.firstChild.remove();
        }
    }
}