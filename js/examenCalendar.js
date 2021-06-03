var hoy = new Date();
var tablero = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

class calendar{
    constructor(){
        this.tablero = tablero;
        let cont=0;
        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                tablero[i][j] = new Date(hoy.getFullYear(), hoy.getMonth(), cont);
                cont++;
            }
        }
    }
}

function empezar() {

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

    console.log(hoy.getDay());
    let calendario = new calendar();
    console.log(calendario)




}