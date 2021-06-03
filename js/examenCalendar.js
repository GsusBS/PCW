var hoy = new Date();
var seleccion = new Date();
var tablero = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

var eventillos = [
    [new Date(2021, 05, 14), "Incendiar la Uni"],
    [new Date(2021, 05, 27), "Pelear con patos"],
    [new Date(2021, 05, 04), "Aprobar PCW"]


];


class calendar {
    constructor() {
        this.tablero = tablero;
        let cont = 0;
        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                tablero[i][j] = new Date(hoy.getFullYear(), hoy.getMonth(), cont);
                cont++;
            }
        }
    }

    seleccionMesAno() {
        let cont = 0;
        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                tablero[i][j] = new Date(seleccion.getFullYear(), seleccion.getMonth(), cont);
                cont++;
            }
        }

    }
}
let calendario = new calendar();

function empezar() {

    //console.log(calendario)

    imprimirCalendario(); //Muestra el calendario por pantalla (rellena el table)
    sacarMesAno(); // Para la paginacion de arriba, saca el mes y año por pantalla
    eventosProximos(); // Lista de eventos 




}

function imprimirCalendario() {
    let html = '';

    html += `<tr id="cabecera">`;
    html += `<th>L</th>`;
    html += `<th>M</th>`;
    html += `<th>X</th>`;
    html += `<th>J</th>`;
    html += `<th>V</th>`;
    html += `<th>S</th>`;
    html += `<th>D</th>`;
    html += `</tr>`;
    document.getElementById("calendario").innerHTML = html;
    for (let i = 0; i < calendario.tablero.length; i++) {
        html += `<tr>`;
        for (let j = 0; j < calendario.tablero[i].length; j++) {
            if (calendario.tablero[i][j].getMonth() == hoy.getMonth()) {

                if (calendario.tablero[i][j].getDay() == 0) {
                    html += `<th class="domingo">`;
                } else {
                    html += `<th>`;
                }

                html += calendario.tablero[i][j].getDate();
            } else {
                html += `<th>`;
                html += ` `;
            }
            html += `</th>`;

        }
        html += `</tr>`;
    }
    document.getElementById("calendario").innerHTML = html;
}

function sacarMesAno() {
    let mes = mesPalabra();
    let html2 = "";
    html2 += `<p>`;
    html2 += mes;
    html2 += `, `;
    html2 += seleccion.getFullYear();
    html2 += `</p>`;
    document.getElementById("fecha").innerHTML = html2;
}

function mesPalabra() {
    let mes = "Enero";
    switch (seleccion.getMonth()) {
        case 1:
            mes = "Febrero";
            break;
        case 2:
            mes = "Marzo";
            break;
        case 3:
            mes = "Abril";
            break;
        case 4:
            mes = "Mayo";
            break;
        case 5:
            mes = "Junio";
            break;
        case 6:
            mes = "Julio";
            break;
        case 7:
            mes = "Agosto";
            break;
        case 8:
            mes = "Septiembre";
            break;
        case 9:
            mes = "Octubre";
            break;
        case 10:
            mes = "Noviembre";
            break;
        case 11:
            mes = "Diciembre";
            break;


    }


    return mes;
}

function anterior() {
    let nuevoMes = seleccion.getMonth();
    seleccion.setMonth(nuevoMes - 1);
    calendario.seleccionMesAno();
    sacarMesAno();
    imprimirCalendario();

}

function siguiente() {
    let nuevoMes = seleccion.getMonth();
    seleccion.setMonth(nuevoMes + 1);
    calendario.seleccionMesAno();
    sacarMesAno();
    imprimirCalendario();

}

function eventosProximos() {
    let html = '';
    for (i = 0; i < eventillos.length; i++) {
        html += `<li> {` + eventillos[i][0].getDate() + `-` + eventillos[i][0].getMonth() + '-' + eventillos[i][0].getFullYear() + `, ` + eventillos[i][0].getHours() + ':' + eventillos[i][0].getMinutes() + ` } ` + eventillos[i][1] + `</li>`;
    }
    document.getElementById("eventos").innerHTML = html;



}