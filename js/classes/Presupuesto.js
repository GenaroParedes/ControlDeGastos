//Clases - Siempre antes de escribir codigo ver que clases nos hacen falta, en este caso necesitamos
//una para llevar un control del prespuesto y otra para la IU 
export class Prespuesto {
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