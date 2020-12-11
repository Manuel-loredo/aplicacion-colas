// Nos sirve para guardar en el archivo
const fs = require('fs');

class Ticket {

    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }

}


class TicketControl {

        constructor() {
            
            this.ultimo = 0;
            this.hoy = new Date().getDate();
            this.tickets = [];
            this.ultimos4 = [];
            let data = require('../data/data.json');
            
            //por si se cae el sistema y por alguna cuasa retomamos donde nos quedamos
            if(data.hoy === this.hoy){
                this.ultimo = data.ultimo;
                this.tickets = data.tickets;
                this.ultimos4 = data.ultimos4;
            }else {
                // por si es un dia nuevo y empieza de cero
                this.reiniciarConteo();
            }
        }

        siguiente() {

            this.ultimo += 1;
            let ticket = new Ticket(this.ultimo, null);
            this.tickets.push(ticket);
            
            this.grabarArchivo();
        //regresa cual es el siguiente ticket para asi mostrarlo en pantalla
            return `Ticket ${this.ultimo}`;

        }

        getUltimoTicket() {
            return `Ticket ${this.ultimo}`;
        }

        getUltimos4() {
            return this.ultimos4;
        }

        atenderTicket(escritorio) {

            //verifico que existan tickets pendientes por atender
            if(this.tickets.length === 0) {
                return 'No hay tickets';
            }
            //se extrae el numero
            let numeroTicket = this.tickets[0].numero;
            // se elimina la primera posicion del arreglo
            this.tickets.shift();
            //creo un nuevo ticket el cuel es el que se va a atender
            let atenderTicket = new Ticket(numeroTicket, escritorio);
            //agregamos el ticket al inicio del arreglo
            this.ultimos4.unshift(atenderTicket);
            //verificamos que solo existan 4 ticket en ese arreglo
            if(this.ultimos4.length > 4) {
                this.ultimos4.splice(-1,1);// borra el ultimo elemento
            }

            console.log('Ultimos 4');
            console.log(this.ultimos4);

            this.grabarArchivo();
            
                return atenderTicket;
        }

        reiniciarConteo() {

            this.ultimo = 0;
            this.tickets = [];
            this.ultimos4 = [];
            console.log('se a iniializado el sistema');
        //actualiza el json con el dia y el conteo lo iguala a 0 para iniciar
            this.grabarArchivo();

        }

        grabarArchivo() {
        
            let jsonData = {
                ultimo: this.ultimo,
                hoy: this.hoy,
                tickets: this.tickets,
                ultimos4: this.ultimos4
            }

            let jsonDataString = JSON.stringify(jsonData);
            fs.writeFileSync('./server/data/data.json', jsonDataString);
        

        }
}

module.exports = {
    TicketControl
}