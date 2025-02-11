//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const listadoGasto = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}


//Clases - Siempre antes de escribir codigo ver que clases nos hacen falta, en este caso necesitamos
//una para llevar un control del prespuesto y otra para la IU 
class Prespuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto); //Number me convierte el string ingresado en int o float, depende como sea ese valor
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
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
        console.log(restante);
        console.log(presupuesto *0.25)
        console.log(presupuesto *0.50)
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
        }
    }

    limpiarHTML(){
        while(listadoGasto.firstChild){
            listadoGasto.firstChild.remove();
        }
    }
}

//Instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto(){
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
function agregarGasto(e){
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

function eliminarGasto(id){
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    console.log(restante);
    ui.comprobarPresupuesto(presupuesto);
}