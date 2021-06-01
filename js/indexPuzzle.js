/* Practica Puzzle 2021     */
class pieza {
    constructor(x, y) {
        this.posActual = [0, 0],
            this.posCorrecta = [x, y],
            this.seleccionada = false,
            this.colocada = false;
    }

    compruebaPos() {
        if (this.posActual[0] == this.posCorrecta[0] && this.posActual[1] == this.posCorrecta[1]) {
            this.colocada = true;
        }
    }


    setPosActual(x, y) {
        this.posActual = [x, y];
    }
    setPosCorrecta(x, y) {
            this.posCorrecta = [x, y];
        }
        //Getter
    posActual() {
        return this.posActual;
    }
    posCorrecta() {
        return this.posCorrecta;
    }
    isSelected() {
        return this.seleccionada;
    }
    isColocada() {
        return this.colocada;
    }
    setSelected(estado) {
        this.seleccionada = estado;
    }

}

var array4x4 = [
    [new pieza(0, 0), new pieza(0, 1), new pieza(0, 2), new pieza(0, 3)],
    [new pieza(1, 0), new pieza(1, 1), new pieza(1, 2), new pieza(1, 3)],
    [new pieza(2, 0), new pieza(2, 1), new pieza(2, 2), new pieza(2, 3)],
    [new pieza(3, 0), new pieza(3, 1), new pieza(3, 2), new pieza(3, 3)]
];

var array6x6 = [
    [new pieza(0, 0), new pieza(0, 1), new pieza(0, 2), new pieza(0, 3), new pieza(0, 4), new pieza(0, 5)],
    [new pieza(1, 0), new pieza(1, 1), new pieza(1, 2), new pieza(1, 3), new pieza(1, 4), new pieza(1, 5)],
    [new pieza(2, 0), new pieza(2, 1), new pieza(2, 2), new pieza(2, 3), new pieza(2, 4), new pieza(2, 5)],
    [new pieza(3, 0), new pieza(3, 1), new pieza(3, 2), new pieza(3, 3), new pieza(3, 4), new pieza(3, 5)],
    [new pieza(4, 0), new pieza(4, 1), new pieza(4, 2), new pieza(4, 3), new pieza(4, 4), new pieza(4, 5)],
    [new pieza(5, 0), new pieza(5, 1), new pieza(5, 2), new pieza(5, 3), new pieza(5, 4), new pieza(5, 5)]
];


var array8x8 = [
    [new pieza(0, 0), new pieza(0, 1), new pieza(0, 2), new pieza(0, 3), new pieza(0, 4), new pieza(0, 5), new pieza(0, 6), new pieza(0, 7)],
    [new pieza(1, 0), new pieza(1, 1), new pieza(1, 2), new pieza(1, 3), new pieza(1, 4), new pieza(1, 5), new pieza(1, 6), new pieza(1, 7)],
    [new pieza(2, 0), new pieza(2, 1), new pieza(2, 2), new pieza(2, 3), new pieza(2, 4), new pieza(2, 5), new pieza(2, 6), new pieza(2, 7)],
    [new pieza(3, 0), new pieza(3, 1), new pieza(3, 2), new pieza(3, 3), new pieza(3, 4), new pieza(3, 5), new pieza(3, 6), new pieza(3, 7)],
    [new pieza(4, 0), new pieza(4, 1), new pieza(4, 2), new pieza(4, 3), new pieza(4, 4), new pieza(4, 5), new pieza(4, 6), new pieza(4, 7)],
    [new pieza(5, 0), new pieza(5, 1), new pieza(5, 2), new pieza(5, 3), new pieza(5, 4), new pieza(5, 5), new pieza(5, 6), new pieza(5, 7)],
    [new pieza(6, 0), new pieza(6, 1), new pieza(6, 2), new pieza(6, 3), new pieza(6, 4), new pieza(6, 5), new pieza(6, 6), new pieza(6, 7)],
    [new pieza(7, 0), new pieza(7, 1), new pieza(7, 2), new pieza(7, 3), new pieza(7, 4), new pieza(7, 5), new pieza(7, 6), new pieza(7, 7)]

];

var ultimaPieza = "";

var nuestroarray = [];

function randomArray(array) {
    nuestroarray.sort(function() { return Math.random() - 0.5 });
    for (var i = 0; i < array.length; i++) {
        nuestroarray[i].sort(function() { return Math.random() - 0.5 });
        for (var j = 0; j < array[i].length; j++) {
            nuestroarray[i][j].setPosActual(j, i);
        }
    }
    console.log(nuestroarray);
}



function compruebaArray() {

    for (var i = 0; i < nuestroarray.length; i++) {
        for (var j = 0; j < nuestroarray[i].length; j++) {
            if (nuestroarray[i][j].isColocada() != true) {
                return false;
            };
        }
    }
    return true;
}



let cont = 0;

function jugadas() {
    cont++;
    document.getElementById('cont1').innerHTML = cont;
}

function regionesCanvas() {
    let div = 4;
    if (sessionStorage.dificultad == '4x4') {
        nuestroarray = array4x4;
        div = 4;
    } else if (sessionStorage.dificultad == '6x6') {
        nuestroarray = array6x6;
        div = 6;
    } else if (sessionStorage.dificultad == '8x8') {
        nuestroarray = array8x8;
        div = 8;
    }

    randomArray(nuestroarray);
    divisiones();

    let cv = document.querySelector('#cv01');
    cv.onclick = function(evt) {
        let x = evt.offsetX,
            y = evt.offsetY,
            ancho = cv.width / div,
            alto = cv.height / div,
            //funcion matematica que nos de el entero mas proximo menor
            fila = Math.floor(y / alto);
        col = Math.floor(x / ancho);

        console.log(x + ',' + y);
        console.log("raton: " + col + ',' + fila);

        //pintar la correspondiente region
        let cv2 = document.querySelector('#cv02'),
            cv1 = cv,
            ctx1 = cv1.getContext('2d');

        nuestroarray[fila][col].compruebaPos();
        console.log("ultima pieza: ");
        console.log(ultimaPieza);
        console.log("pieza seleccionada: ");
        console.log(nuestroarray[fila][col]);

        colCanvasDestino = nuestroarray[fila][col].posActual[0];
        filaCanvasDestino = nuestroarray[fila][col].posActual[1];

        colCanvasOrigen = nuestroarray[fila][col].posCorrecta[0];
        filaCanvasOrigen = nuestroarray[fila][col].posCorrecta[1];

        console.log("pos correcta: " + nuestroarray[fila][col].posCorrecta[0] + ',' + nuestroarray[fila][col].posCorrecta[1]);
        console.log("pos actual: " + nuestroarray[fila][col].posActual[0] + ',' + nuestroarray[fila][col].posActual[1]);

        //muestro la ficha seleccionada
        //la segunda parte que se repite, sería la que habria que poner de otra parte


        if (nuestroarray[fila][col].isColocada() == true) {
            if (compruebaArray() == true) {
                console.log("completado");
                mostrarMensajeCompletado()
            }
            ctx1.drawImage(cv2, nuestroarray[fila][col].posCorrecta[0] * ancho, nuestroarray[fila][col].posCorrecta[1] * alto, ancho, alto, nuestroarray[fila][col].posActual[0] * ancho, nuestroarray[fila][col].posActual[1] * alto, ancho, alto);
        } else if (nuestroarray[fila][col].isColocada() != true) {
            if (ultimaPieza != "") {
                var posCorrectaTemp = nuestroarray[fila][col].posCorrecta;
                pieza2 = ultimaPieza;

                nuestroarray[fila][col].setPosCorrecta(ultimaPieza.posCorrecta[0], ultimaPieza.posCorrecta[1]);
                ultimaPieza.setPosCorrecta(posCorrectaTemp[0], posCorrectaTemp[1]);


                nuestroarray[fila][col].compruebaPos();
                ultimaPieza.compruebaPos();

                console.log(ultimaPieza);
                //dibujado de la pieza nueva
                ctx1.drawImage(cv2, nuestroarray[fila][col].posCorrecta[0] * ancho, nuestroarray[fila][col].posCorrecta[1] * alto, ancho, alto, nuestroarray[fila][col].posActual[0] * ancho, nuestroarray[fila][col].posActual[1] * alto, ancho, alto);
                setTimeout(compruebaPosActual, 1000, posCorrectaTemp);
                //dibujado de la pieza anterior
                ctx1.drawImage(cv2, ultimaPieza.posCorrecta[0] * ancho, ultimaPieza.posCorrecta[1] * alto, ancho, alto, ultimaPieza.posActual[0] * ancho, ultimaPieza.posActual[1] * alto, ancho, alto);
                //setInterval(compruebaPosUltima(), 500);

                var ultimapiezax = ultimaPieza.posActual[0],
                    ultimapiezay = ultimaPieza.posActual[1],
                    pieza1 = nuestroarray[fila][col];

                setTimeout(compruebaPosUltima, 1000, ultimapiezax, ultimapiezay, pieza2);
                ultimaPieza = "";
                jugadas();
                //cuando se termina el Juego
                if (compruebaArray() == true) {
                    console.log("completado");
                    mostrarMensajeCompletado()
                }
            } else {
                //dibujado de la pieza hemos seleccionado una vez
                ctx1.drawImage(cv2, colCanvasOrigen * ancho, filaCanvasOrigen * alto, ancho, alto, colCanvasDestino * ancho, filaCanvasDestino * alto, ancho, alto);
                ultimaPieza = nuestroarray[fila][col];
                ctx1.fillStyle = "rgba(255, 0, 0, 0.5)";
                ctx1.fillRect(colCanvasDestino * ancho, filaCanvasDestino * alto, ancho, alto)
                ctx1.stroke();
            }

            function compruebaPosActual() {
                console.log("hola" + pieza1.isColocada());
                pieza1.compruebaPos();
                if (pieza1.isColocada() != true) {
                    ctx1.fillStyle = "rgba(255, 255, 255)";
                    ctx1.fillRect(nuestroarray[fila][col].posActual[0] * ancho, nuestroarray[fila][col].posActual[1] * alto, ancho, alto)

                    ctx1.stroke();
                }
            }

            function compruebaPosUltima(ultimax, ultimay) {
                pieza2.compruebaPos();
                console.log("ultimax " + ultimax, "ultimay " + ultimay);
                if (pieza2.isColocada() != true) {
                    ctx1.fillStyle = "rgba(255, 255, 255)";
                    ctx1.fillRect(ultimax * ancho, ultimay * alto, ancho, alto)

                    ctx1.stroke();
                }
            }
        }
        divisiones();
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

                ctx.fillStyle = "rgba(255, 255, 255)";
                ctx.fillRect(0, 0, cv2.width, cv2.height)

                ctx.drawImage(img, 0, posY, cv2.width, cv2.height * factor);
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


    if (sessionStorage.dificultad && sessionStorage.id) {

        sessionStorage['imagen'] = sessionStorage.id;

        document.location.href = 'juego.html';

    } else {

        sessionStorage['dificultad'] = "";
        sessionStorage['imagen'] = "";
        mostrarMensaje();

    }
}
//https://www.youtube.com/watch?v=llWqMUohBYU 1:15 como hacer el mensaje modal

function mostrarMensaje() {
    let texto;
    let html = '';

    html = '<article>';
    html += '<h2> ERROR </h2>';
    html += '<p>Los campos no estan rellenados bien</p>';
    html += '<p>Porfavor elija una foto y una dificultad</p>';
    html += '<footer><button class="boton" onclick="cerrarMensaje()" > Aceptar </button>'; // aqui mejor ocultar el elemento
    html += '</article>';

    Popup(html);
}

function mostrarMensajeCompletado() {
    let texto;
    let html = '';

    html = '<article>';
    html += '<h2> FELICIDADES </h2>';
    html += '<p>¡Has completado el puzzle!</p>';

    html += '<form id="frmFIN" onsubmit="return insertarJugador(this);">';
    html += '<label for="nombre">Escribe tu nombre aquí</label>';
    html += '<input type="text" name="nombre" placeholder="Nombre">';

    html += '<footer>  <input type="submit" value="Enviar" > </form></footer>';
    html += '</article>';


    Popup(html);
}



function Popup(html) {
    let div = document.createElement('div');

    div.setAttribute('id', 'popup');
    div.innerHTML = html;

    document.querySelector('body').appendChild(div);

}

function cerrarMensaje() {
    document.querySelector('#popup').remove();
}

function comprobar() {
    if (!sessionStorage.dificultad || !sessionStorage.imagen) {
        location.href = './index.html';
    }
}

/* Funcion de ejemplo de un Post*/

function insertarJugador(frm) {


    let url = './api/puntuaciones',
        fd = new FormData();

    fd.append("nombre", frm.nombre.value);
    fd.append("id_imagen", sessionStorage.id);
    fd.append("dificultad", sessionStorage.dificultad);
    fd.append("jugadas", cont);
    console.log("fd ", fd);

    xhr = new XMLHttpRequest();

    xhr.open('POST', url, true); //porque el login es de tipo post, el true es de asincrona
    xhr.onload = function() {
        console.log(xhr.responseText);


        let r = JSON.parse(xhr.responseText); //convertimos el json en un objeto de javascript

        if (r.RESULTADO == 'OK') {



        } else {
            console.log("Error en la peticion");


        }
    };
    xhr.send(fd);

    sessionStorage.clear();
    cerrarMensaje();
    location.href = 'index.html';
    return false;

}

function Terminar() {
    let texto;
    let html = '';

    html = '<article>';
    html += '<h2> LASTIMA </h2>';
    html += '<p>Has realizado: ' + cont + ' jugadas</p>';
    html += '<p>Vuelva a interlo proximamente</p>';
    html += '<footer><button class="boton" onclick="volverIndex()" > Aceptar </button>'; // aqui mejor ocultar el elemento
    html += '</article>';

    Popup(html);
}

function volverIndex() {
    sessionStorage.clear();
    location.href = './index.html';

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

            html += `<div >`;
            html += ' Imagen:';
            html += `</div >`;
            html += `<div >`;



            document.getElementById("Imagenes").innerHTML = html;
            r.FILAS.forEach(function(e) {




                html += `<div id="selectImagen" class="Imgnum${e.id} "onClick="seleccionado(${e.id})" ">`;

                html += `<img src="./imagenes/${e.fichero}" alt="${e.fichero}" class="imagenesMinions"   >`;

                html += `<footer>`;
                html += `<p> ${e.nombre} </p>`;
                html += `</footer>`;
                html += `</div>`;

                document.getElementById("Imagenes").innerHTML = html;
            });

            html += `</div  >`;
            document.getElementById("Imagenes").innerHTML = html;
        }
    }

    xhr.send();

}

function seleccionado(num) {
    sessionStorage.id = num;
    //var cols = document.getElementsByClassName('col1');

    var resto;

    for (i = 1; i < 7; i++) {

        resto = document.getElementsByClassName("Imgnum" + i);
        console.log(resto);
        resto[0].style.borderColor = "black";

    }

    var doc = document.getElementsByClassName("Imgnum" + sessionStorage.id);
    console.log("doc", doc[0]);
    doc[0].style.borderColor = "red";


}


function PuntuacionesPuzzle() {
    let html = '';
    if (sessionStorage.getItem("indexpag") == null) {
        sessionStorage.setItem("indexpag", 0);
    }

    let xhr = new XMLHttpRequest();
    let url = './api/puntuaciones/?ord=j,dd,ja&pag=' + sessionStorage['indexpag'] + '&lpag=3';

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
                html += `<td>${pos+(sessionStorage['indexpag']*3)}</td>`;
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

function selectdificultad(value) {
    sessionStorage['dificultad'] = value;
}

function siguienteArt() {


    sessionStorage.setItem("indexpag", parseInt(sessionStorage.getItem("indexpag")) + 1);
    document.querySelector('#numpag').innerHTML = parseInt(sessionStorage.getItem("indexpag")) + 1;
    PuntuacionesPuzzle();
}


function anteriorArt() {

    if (sessionStorage.getItem("indexpag") > 0) {

        sessionStorage.setItem("indexpag", parseInt(sessionStorage.getItem("indexpag")) - 1);
        document.querySelector('#numpag').innerHTML = parseInt(sessionStorage.getItem("indexpag")) + 1;
        PuntuacionesPuzzle();
    }


}