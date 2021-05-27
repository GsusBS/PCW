var array4x4 = [
    [0.0, 0.1, 0.2, 0.3],
    [1.0, 1.1, 1.2, 1.3],
    [2.0, 2.1, 2.2, 2.3],
    [3.0, 3.1, 3.2, 3.3]
];

var array6x6 = [
    [0.0, 0.1, 0.2, 0.3, 0.4, 0.5],
    [1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
    [2.0, 2.1, 2.2, 2.3, 2.4, 2.5],
    [3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
    [4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
    [5.0, 5.1, 5.2, 5.3, 5.4, 5.5]
];


var array8x8 = [
    [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
    [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7],
    [2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7],
    [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
    [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7],
    [5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7],
    [6.0, 6.1, 6.2, 6.3, 6.4, 6.6, 6.6, 6.7],
    [7.0, 7.1, 7.2, 7.3, 7.4, 7.7, 7.6, 7.7]

];


function randomArray(array) {

    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            var i1 = Math.floor(Math.random() * (array.length));
            var j1 = Math.floor(Math.random() * (array.length));

            var temp = array[i][j];
            array[i][j] = array[i1][j1];
            array[i1][j1] = temp;
        }
    }
}

function inicioprueba() {


    console.log("Antes ", array9x9);
    randomArray(array9x9);
    console.log("Despues", array9x9);
}



let cont = 0;

function jugadas() {
    cont++;
    document.getElementById('cont1').innerHTML = cont;
}

function regionesCanvas() {
    let div = 4;
    if (sessionStorage.dificultad == '4x4') {
        div = 4;
    } else if (sessionStorage.dificultad == '6x6') {
        div = 6;
    } else if (sessionStorage.dificultad == '8x8') {
        div = 8;
    }
    let cv = document.querySelector('#cv01');

    cv.onclick = function(evt) {
        jugadas();
        let x = evt.offsetX,
            y = evt.offsetY,
            ancho = cv.width / div,
            alto = cv.height / div,
            //funcion matematica que nos de el entero mas proximo menor
            fila = Math.floor(y / alto);
        col = Math.floor(x / ancho);

        console.log(x + ',' + y);
        console.log(col + ',' + fila);

        //pintar la correspondiente region
        let cv2 = document.querySelector('#cv02'),
            cv1 = cv,
            ctx1 = cv1.getContext('2d');

        //la segunda parte que se repite, sería la que habria que poner de otra parte
        ctx1.drawImage(cv2, col * ancho, fila * alto, ancho, alto, col * ancho, fila * alto, ancho, alto);


    };

}

function divisiones() {
    let div = 4;
    if (sessionStorage.dificultad == '4x4') {
        div = 4;
    } else if (sessionStorage.dificultad == '6x6') {
        div = 6;
    } else if (sessionStorage.dificultad == '8x8') {
        div = 8;
    }
    let cv1 = document.querySelector('#cv01'),
        ctx1 = cv1.getContext('2d');
    ancho = cv1.width / div;
    alto = cv1.height / div;

    ctx1.beginPath();
    ctx1.lineWidth = 2;
    ctx1.strokeStyle = '#a00';

    for (let i = 1; i < div; i++) {
        // verticales
        ctx1.moveTo(i * ancho, 0);
        ctx1.lineTo(i * ancho, cv1.height);
        //horizontales
        ctx1.moveTo(0, i * alto);
        ctx1.lineTo(cv1.width, i * alto);

    }
    ctx1.stroke();
}

function prepararCanvas() {
    let cv1 = document.querySelector('#cv01'),
        ctx1 = cv1.getContext('2d');

    cv1.width = 480;
    cv1.height = 360;


}

function prepararCanvas2() {
    let xhr = new XMLHttpRequest(),
        url = 'api/imagenes/' + sessionStorage.imagen;
    console.log(url);

    xhr.open('GET', url, true);

    xhr.onload = async function() {
        let v = JSON.parse(xhr.responseText);
        if (v.RESULTADO == 'OK') {
            console.log("Peticion realizada con exito.");
            let img = new Image();
            img.onload = function() {
                let cv2 = document.querySelector('#cv02'),
                    ctx2 = cv2.getContext('2d');

                cv2.width = 480;
                cv2.height = 360;

                let ctx = cv2.getContext('2d'),
                    factor = cv2.width / img.width,
                    posY = (cv2.height - cv2.height * factor) / 2;

                ctx.drawImage(img, 0, posY, cv2.width, cv2.height * factor);
                divisiones();
                regionesCanvas();

            };
            img.src = "imagenes/" + v.FILAS[0].fichero;
            console.log(v.FILAS[0].fichero)
        };
    };

    xhr.onerror = function() {
        console.log('ERROR');
    };

    xhr.send();
}


function hacerLogin(frm) {
    var dificultad = frm.dificultad.value,
        imagen = frm.imagen.value;
    if (dificultad != "" && imagen != "") {
        sessionStorage['dificultad'] = frm.dificultad.value;
        sessionStorage['imagen'] = frm.imagen.value;

        document.location.href = 'juego.html';
        return true;
    } else {
        sessionStorage['dificultad'] = "";
        sessionStorage['imagen'] = "";
        mostrarMensaje();
        return false;
    }
}
//https://www.youtube.com/watch?v=llWqMUohBYU 1:15 como hacer el mensaje modal

function mostrarMensaje() {
    let div = document.createElement('div'),
        html;

    div.id = 'msj-modal';
    html = `<article>
                <h2>Tienes que seleccionar ambos campos para empezar el juego</h2>
                <footer>
                    <button onclick="document.querySelector('#msj-modal').remove();">Cerrar</button>
                </footer>
                </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}





function crearBotonStart() {


    html = '';

    html = `<button id="startButton" class="btn" onclick="puzzleStart();">Empezar</button>`;

    document.getElementById('btnStart').innerHTML = html;

}



/* ----- INDEX ----- */
function FotosPuzzle() {
    let html = '';

    let xhr = new XMLHttpRequest();
    let url = './api/imagenes/';

    xhr.open('GET', url, true);
    xhr.onload = function() {

        let r = JSON.parse(xhr.responseText);
        if (r.RESULTADO == 'OK') {

            r.FILAS.forEach(function(e) {

                html += `<div id="selectImagen">`;

                html += `<img src="./imagenes/${e.fichero}" alt="${e.fichero}" class="imagenesMinions" >`;

                html += `<footer>`;
                html += `<p> ${e.nombre} </p>`;
                html += `</footer>`;
                html += `</div>`;

                document.getElementById("Imagenes").innerHTML = html;
            });
        }
    }

    xhr.send();

}

function PuntuacionesPuzzle() {
    let html = '';

    let xhr = new XMLHttpRequest();
    let url = './api/puntuaciones/?ord=j';
    let pos = 0;
    xhr.open('GET', url, true);
    xhr.onload = function() {

        let r = JSON.parse(xhr.responseText);
        if (r.RESULTADO == 'OK') {
            html += `<tr id="cabecera">`;
            html += `<th>Pos.</th>`;
            html += `<th>Imagen</th>`;
            html += `<th>Jugador</th>`;
            html += `<th>Nivel</th>`;
            html += `<th>Jugadas</th>`;
            html += `</tr>`;
            document.getElementById("tablaPut").innerHTML = html;

            r.FILAS.forEach(function(e) {
                pos++;

                html += `<tr>`;
                html += `<td>${pos}</td>`;
                html += `<td>${e.nombre}</td>`;
                html += `<td>${e.usuario}</td>`;
                html += `<td>${e.dificultad}</td>`;
                html += `<td>${e.jugadas}</td>`;
                html += `</tr>`;



                document.getElementById("tablaPut").innerHTML = html;
            });
        }
    }

    xhr.send();

}