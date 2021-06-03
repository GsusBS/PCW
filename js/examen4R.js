// Fichas 0: vacia
// Fichas 1: Jugador 1
// Fichas 2: Jugador 2

var tablero = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];


// Jugador 1: True
// Jugador 2: False
var turno = true;


/* ---- Mensaje Modal ---- */
function empezar() { //Se crea similar a funcion MostrarMensaje() en puzzle
    let texto;
    let html = '';

    html = '<article>';
    html += '<h2> 4 en raya </h2>';
    html += '<p>Pincha aqui para jugar</p>';
    html += '<footer><button class="boton" onclick="cerrarMensaje()" > Aceptar </button>'; // aqui mejor ocultar el elemento
    html += '</article>';

    Popup(html);
}


function Popup(html) { //Propiedades
    let div = document.createElement('div');

    div.setAttribute('id', 'popup');
    div.innerHTML = html;

    document.querySelector('body').appendChild(div);

}

function cerrarMensaje() { //Cerrar
    document.querySelector('#popup').remove();
}

/* --- Dibujado de Canvas ---*/

//funcion de dibujado de lineas
function divisiones() {

    //Cuantos cuadros en x e y
    let divX = 6;
    let divY = 7;

    let cv1 = document.querySelector('#cv'),
        ctx1 = cv1.getContext('2d');

    ancho = cv1.width / divX;
    alto = cv1.height / divY;

    ctx1.beginPath();
    ctx1.lineWidth = 2;
    ctx1.strokeStyle = "rgb(0,0,0)";

    for (let i = 1; i < divY; i++) {
        // verticales
        ctx1.moveTo(i * ancho, 0);
        ctx1.lineTo(i * ancho, cv1.height);
        //horizontales
        ctx1.moveTo(0, i * alto);
        ctx1.lineTo(cv1.width, i * alto);

    }
    ctx1.stroke();
}

//funcion de preparado del canvas, pinta de blanco el fondo
function prepararCanvas() {
    let cv2 = document.querySelector('#cv'),
        ctx2 = cv2.getContext('2d');

    cv2.width = 500;
    cv2.height = 500;

    let ctx = cv2.getContext('2d');

    ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.fillRect(0, 0, cv2.width, cv2.height)

    regionesCanvas();


}


/* ---- Pintar Css ---- */
function pintarTurno() {
    // Pinta los divs de jugador segun su turno

    var j1 = document.getElementById("jugador1");
    var j2 = document.getElementById("jugador2");
    if (turno) {
        j1.style.borderColor = "yellow";
        j2.style.borderColor = "black";
    } else {
        j1.style.borderColor = "black";
        j2.style.borderColor = "yellow";
    }
}

/* ---- Pintar Canvas ---- */
function regionesCanvas() {
    let divX = 6;
    let divY = 7;

    divisiones();
    pintarTurno();
    let cv = document.querySelector('#cv');
    ctx = cv.getContext('2d');

    cv.onclick = function(evt) {

        turno = !turno;
        pintarTurno();

        let x = evt.offsetX,
            y = evt.offsetY,
            ancho = cv.width / divX,
            alto = cv.height / divY,
            //funcion matematica que nos de el entero mas proximo menor
            fila = Math.floor(y / alto);
        col = Math.floor(x / ancho);



        //console.log(x + ',' + y);
        //orden de mostrar la x y la y,  Jesus:
        //console.log("raton: " + col + ',' + fila);
        //personas normales:
        //console.log("raton: " + fila + ',' + col);

        if (tablero[fila][col] == 0) {
            if (turno) {
                ctx.fillStyle = "rgba(255, 0, 0)";
                tablero[fila][col] = 2
                setTimeout(compruebaSiguiente, 50, fila, col, ancho, alto, 2);
            } else {
                ctx.fillStyle = "rgba(0, 0, 255)";
                tablero[fila][col] = 1

                setTimeout(compruebaSiguiente, 50, fila, col, ancho, alto, 1);
            }

            //ctx.fillRect(col * ancho, fila * alto, ancho, alto);
        } else {
            turno = !turno;
        }
        divisiones()

    };

    cv.onmousemove = function(evt) {
        //Cuando el raton se mueve por el canvas

        let x = evt.offsetX,
            y = evt.offsetY,
            ancho = cv.width / divX,
            alto = cv.height,
            //funcion matematica que nos de el entero mas proximo menor
            fila = Math.floor(y / alto);
        col = Math.floor(x / ancho);
        if (tablero[fila][col] == 0) {
            //En este caso necesitamos pintar la columna entera donde este el mouse
            ctx.fillStyle = "rgba(170, 169, 180, 1)";
            ctx.fillRect(col * ancho, 0, ancho, alto);

            pintarRelleno(col, ancho, (alto / divY));
            divisiones();

        }

    }
    cv.addEventListener("mouseout", function(evt) {
        //Cuando el raton esta fuera del canvas
        let x = evt.offsetX,
            y = evt.offsetY,
            ancho = cv.width / divX,
            alto = cv.height,
            fila = Math.floor(y / alto);
        col = Math.floor(x / ancho);
        pintarRelleno(col, ancho, (alto / divY));
        divisiones();
    }, false);
}




function compruebaSiguiente(fila, col, ancho, alto, color) {
    divisiones()

    if (turno) {
        ctx.fillStyle = "rgba(255, 0, 0)";
        //console.log(turno);
    } else {
        ctx.fillStyle = "rgba(0, 0, 255)";
        //console.log(turno);
    }
    ctx.fillRect(col * ancho, fila * alto, ancho, alto);

    if (fila + 1 < tablero.length && tablero[fila + 1][col] == 0) {
        setTimeout(pintarBlanco, 50, fila, col, ancho, alto, color);
    } else {

        tablero[fila][col] = color;
    }


}

function pintarBlanco(fila, col, ancho, alto, color) {
    ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.fillRect(col * ancho, fila * alto, ancho, alto);
    tablero[fila][col] = 0;
    setTimeout(compruebaSiguiente, 0, fila + 1, col, ancho, alto, color);
}


// Vuelve a pintar las celdas segun si hay una ficha 1, 2 o 0
function pintarRelleno(col, ancho, alto) {
    for (i = 0; i < tablero.length; i++) {
        for (j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j] == 1) {

                ctx.fillStyle = "rgba(0, 0, 255)";
                ctx.fillRect(j * ancho, i * alto, ancho, alto);

            } else if (tablero[i][j] == 2) {
                ctx.fillStyle = "rgba(255, 0, 0)";
                ctx.fillRect(j * ancho, i * alto, ancho, alto);

            } else {
                if (j != col) { //Pinta todas las blancas menos la columna donde tengo el raton
                    ctx.fillStyle = "rgba(255, 255, 255)";
                    ctx.fillRect(j * ancho, i * alto, ancho, alto);
                }
            }

        }
    }

}



function finJuego() {
    let texto;
    let html = '';
    let jugador;
    if (turno) {
        jugador = "jugador 2";
    } else {
        jugador = "jugador 1";
    }

    html = '<article>';
    html += '<h2> FELICIDADES ' + jugador + ' </h2>';
    html += '<p>Has terminado el juego en jugadas</p>';
    html += '<footer><button class="boton" onclick="cerrarMensajeyEmpezar()" > Aceptar </button>'; // aqui mejor ocultar el elemento
    html += '</article>';

    Popup(html);
}

function cerrarMensajeyEmpezar() { //Cerrar


    for (i = 0; i < tablero.length; i++) {
        for (j = 0; j < tablero[i].length; j++) {
            tablero[i][j] = 0;
        }
    }
    turno = true;
    pintarTurno();

    document.querySelector('#popup').remove();
    empezar();
}