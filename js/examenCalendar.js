var hoy = new Date();

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





}