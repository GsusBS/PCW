function comprobar() {
    var frm = document.querySelectorAll("form")[0];
    if (frm.ckbGuardar.checked) { // Si se ha marcado guardar datos ...
        localStorage.setItem("login", frm.login.value);
        localStorage["pass"] = frm.pass.value; // modo alternativo
    }
}
function rellenar() { // Se comprueba si hay soporte para Web Storage
    var frm = document.querySelectorAll("form")[0];
    if (localStorage.getItem("login")) { // Si hay datos en localStorage ...
        frm.login.value = localStorage.getItem("login");
        frm.pass.value = localStorage.pass; // modo alternativo
    }
}

//video de clase https://www.youtube.com/watch?v=tgzd8k4gLhk pedir Datos
/*
function pedirRutasIndex(pagina) {
    let xhr = new XMLHttpRequest(),
        url = 'api/get/rutas';

    xhr.open('GET', url, true);

    xhr.onload = function () {
        let v = JSON.parse(xhr.responseText),
            html = '';
        console.log(v);

        /* html += '<ul>';
        v.FILAS.forEach(function (e,idx) {
            html += '<li>Ruta nº ${idx}: ${e.nombre}</li>';
        });

        html += '</ul>';
        v.FILAS.forEach(function (e, idx) {
            html += `
                <article>
                <h3>Ruta nº ${idx + 1}</h2>
                <h2>${e.nombre}</h2>
                            <a href="ruta.html?${idx + 1}"><img src="fotos/rutas/${e.imagen}" alt="Foto de la ruta ${idx + 1}"></a>
                                <figcaption>${e.texto_imagen}</figcaption>
                            </img>
                            <p>Dificultad: ${e.dificultad}</p>
                    <footer>
                        <p>Autor: <a href="buscar.html?${e.login}">${e.login} <img class="imgUsuPerfil" src="fotos/usuarios/${e.foto_autor}"></img></a>
                            <p> <time datetime=${e.fecha_hora}">Fecha: ${e.fecha_hora}</time></p>
                    </footer>
                </article >`;

        });

        document.querySelector('#resultado').innerHTML = html;
    };

    xhr.onerror = function () {
        console.log('ERROR');
    };

    xhr.send();
}*/

function pedirRutasIndex(pagina) {  //SHOW PHOTOS INDEX
    var url = 'api/rutas?pag=' + pagina + '&lpag=6';
    let usu,
        auth;
    console.log(url);
    if (!sessionStorage['pcw']) { //Si NO esta logueado
        MuestraFotosIndexSIN(url);
    }
    else {
        usu = JSON.parse(sessionStorage['pcw']);
        auth = usu.login + ':' + usu.token;
        fetch(url, { 'headers': { 'Authorization': auth } }).then(
            //TODO OK:
            function (response) {
                if (!response.ok) {
                    response.json().then(function (datos) {
                    });
                    return;
                }
                response.json().then(function (datos) {
                    let html = '';
                    datos.FILAS.forEach(function (e) {
                        html += `
                <article>
                <h3>Ruta nº ${e.id}</h2>
                <h2>${e.nombre}</h2>
                            <a href="ruta.html?${e.id}"><img src="fotos/rutas/${e.imagen}" alt="Foto de la ruta ${e.id}"></a>
                                <figcaption>${e.texto_imagen}</figcaption>
                            </img>
                            <p>Dificultad: ${e.dificultad}</p>
                    <footer>
                        <p>Autor: <a href="buscar.html?${e.login}">${e.login} <img class="imgUsuPerfil" src="fotos/usuarios/${e.foto_autor}"></img></a>
                            <p> <time datetime=${e.fecha_hora}">Fecha: ${e.fecha_hora}</time></p>
                    </footer>
                </article >`;

                    });

                    document.querySelector('#resultado').innerHTML = html;
                });
            },
            //All Bad
            function (response) {
                console.log('ERROR');
            });
    }
}

function MuestraFotosIndexSIN(url) { //SIN LOGUEAR!!!!!!!!!
    fetch(url).then(
        //TODO OK:
        function (response) {
            if (!response.ok) {
                response.json().then(function (datos) {
                });
                return;
            }
            response.json().then(function (datos) {
                let html = '';
                datos.FILAS.forEach(function (e) {
                    html += `
                <article>
                <h3>Ruta nº ${e.id}</h2>
                <h2>${e.nombre}</h2>
                            <a href="ruta.html?${e.id}"><img src="fotos/rutas/${e.imagen}" alt="Foto de la ruta ${e.id}"></a>
                                <figcaption>${e.texto_imagen}</figcaption>
                            </img>
                            <p>Dificultad: ${e.dificultad}</p>
                    <footer>
                        <p>Autor: <a href="buscar.html?${e.login}">${e.login} <img class="imgUsuPerfil" src="fotos/usuarios/${e.foto_autor}"></img></a>
                            <p> <time datetime=${e.fecha_hora}">Fecha: ${e.fecha_hora}</time></p>
                    </footer>
                </article >`;

                });

                document.querySelector('#resultado').innerHTML = html;
            });
        },
        //All Bad
        function (response) {
            console.log('ERROR');
        });
}

//video de clase https://www.youtube.com/watch?v=tgzd8k4gLhk hacer login, min 30
function hacerLogin(frm) {

    let url = 'api/post/usuarios/login.php',
        fd = new FormData(frm),
        xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);

    xhr.onload = function () {
        //console.log(xhr.responseText);
        let usu = JSON.parse(xhr.responseText);
        console.log(usu);
        sessionStorage['pcw'] = xhr.responseText;
    };

    xhr.send(fd);

    return false;
}


function hacerLogout() {

    let url = 'api/post/usuarios/logout.php',
        xhr = new XMLHttpRequest(),
        usu, clave;

    if (!sessionStorage['pcw'])
        return;

    usu = JSON.parse(sessionStorage['pcw']);
    clave = usu.login + ':' + usu.token;

    xhr.open('POST', url, true);

    xhr.onload = function () {
        console.log(xhr.responseText);
        let r = JSON.parse(xhr.responseText);
        if (r.RESULTADO == "OK")
            sessionStorage.removeItem('pcw');
    };

    xhr.setRequestHeader('authorization', clave);
    xhr.send();
}

function mostrarImagen(inp) {
    let fr = new FileReader();

    //if(!inp.files[0])
    if (inp.files.length < 1)
        return;

    fr.onload = function () {
        inp.parentNode.querySelector('img').src = fr.result;
    };

    fr.readAsDataURL(inp.files[0]);
}

function enviarFoto() {
    let inp = document.querySelector('#fichero'),
        fd = new FormData(),
        url = 'api/rutas/2/foto',
        usu = JSON.parse(sessionStorage['pcw']),
        xhr = new XMLHttpRequest();

    // envio la foto
    fd.append('fichero', inp.files[0]);
    //  añado texto
    fd.append('texto', inp.parentNode.querySelector('textarea').value);

    xhr.open('POST', url, true);

    xhr.onload = function () {
        console.log(xhr.responseText);
    }

    xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);

    xhr.send(fd);

}
//mostrar titulos de ruta TO DO: MOSTRAR FICHAS DE RUTAS CON TODOS LOS DATOS
//peticion mostrar rutas con fetch
function pedirRutas() {
    let url = 'api/rutas';

    //ejemplo filtrar con pirineos + usuario 3
    // url -= '?t=pirineos&a=usuario3';

    //paginación
    //url += '?pag=1&lpag=2

    fetch(url).then(function (response) {
        if (response.ok) {
            // response.text().then(function (texto) {
            //     console.log(texto);
            // });
            response.json().then(function (datos) {
                //console.log(datos);
                let ul = document.createElement('ul');

                datos.FILAS.forEach(function (e, idx, v) {
                    let li = document.createElement('li');
                    li.innerHTML = e.nombre;
                    //solo para texto li.textContent = e.nombre;
                    ul.appendChild(li);
                });
                document.querySelector('#titulosRutas').innerHTML = ''; //limpiamos contenido para que no se muestren mas cada vez
                document.querySelector('#titulosRutas').appendChild(ul); //añadimos los datos 1 vez
            });
        }
        else {
            console.log('Error ' + response.status + ': ' + response.statusText);
        }
    }).catch(function (error) {
        console.log('Fetch Error: ', err);
    });
}

//https://www.youtube.com/watch?v=llWqMUohBYU 1:15 como hacer el mensaje modal

function mostrarMensaje() {
    let div = document.createElement('div'),
        html;

    div.id = 'msj-modal';
    html = `<article>
                <h2>Tu comentarios se ha guardado correctamente</h2>
                <footer>
                    <button onclick="document.querySelector('#msj-modal').remove();">Cerrar</button>
                </footer>
                </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}

function mostrarMensajeError() {
    let div = document.createElement('div'),
        html;

    div.id = 'msj-modal';
    html = `<article>
                <h2>Tu comentario ha fallado</h2>
                <p>Vuelve a intentarlo</p>
                <footer>
                    <button onclick="document.querySelector('#msj-modal').remove();">Cerrar</button>
                </footer>
                </article>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}

//TO DO: hacer el menu de navegación con el data-pagina para mostrar el menu segun la página

function comprobLog() {
    let menu = document.querySelector('#menu'),
        html = '',
        usu,
        fulano,
        htmlFulano = '';
    if (!sessionStorage['pcw'] || sessionStorage['pcw']==null ) { //Si NO esta logueado
        html += '<li><a href="registro.html">Registro<span class="icon-register"></span><span>Registro</span></a></li>';
        html += '<li><a href="login.html">Login<span class="icon-login"></span><span>Login</span></a></li>';
    }
    if (sessionStorage['pcw'] != null) { //Si SI esta logueado
        console.log("Fulanito: " + sessionStorage['pcw'] + " está logueado.");
        usu = JSON.parse(sessionStorage['pcw']);
        fulano = usu.login;
        console.log("Este es el fulano: " + fulano);
        /*htmlFulano += 'Logout (' + fulano +')';
        console.log("A ver qué pone: " + htmlFulano);
        document.querySelector('#bot3>span:nth-of-type(2)').innerHTML = htmlFulano;*/
        html += '<li><a href="nueva.html">Nueva Ruta<span class="icon-upload"></span><span>Nueva Ruta</span></a></li>';
        html += `<li><a href="index.html" onclick="hacerLogout();"><span class="icon-logout"></span>Logout<span> (${fulano})</span> <img class="imgUsuPerfil" src="fotos/usuarios/${usu.foto}"></img> </a></li>`;
    }
    menu.innerHTML += html;
}

//como tener el id de la ruta a traves de la url, con el BOM
//location.search.subsrt(1).split('=')[1];
//como saber si viene el id de la ruta = location.serach.length


//carga condicional de contenido para solo usuario logeado

//carga condicional para el formulario "dejar Comentario"

function cargaPorContenido() {
    let xhr = new XMLHttpRequest(),
        url = 'formulario.html';

    xhr.open('GET', url, true);

    xhr.onload = function () {
        //xhr.responseText
        document.querySelector('#formulario').innerHTML = xhr.responseText;
    };

    xhr.send();
}


function rutaLOGorNot() {
    if (sessionStorage['pcw'] != null) { //Si el usuario SI esta logueado
        rutaLOG();
        //mostrarFormComentario();
        cargarForm();
    }
    else {
        //ruta(); //no esta logueado.
    }
}

function rutaLOG() { //para foto.html cuando SI estes logueado.
    if (window.location.search == "") {
        location.href = 'index.html';
    }
    var id_ruta = window.location.search;	//Extraigo el numero de id de la foto;
    id_ruta = id_ruta.split("?")[1];

    let aux = '',
        auxFav = '',
        auxTime = '',
        auxDate = '',
        usu = JSON.parse(sessionStorage['pcw']),
        auth = usu.login + ':' + usu.token;

    var url = 'api/rutas/' + id_ruta;

    fetch(url, { 'headers': { 'Authorization': auth } }).then(
        //TODO OK:
        function (response) {
            if (!response.ok) {
                response.json().then(function (datos) {
                    console.log(datos);
                });
                return;
            }

            response.json().then(function (datos) {
                console.log(datos);
                let e = datos.FILAS[0];
                let html = '';
                //console.log(e);

                //Info basica
                document.querySelector('#file-foto').src = 'fotos/rutas/' + e.imagen;
                document.querySelector('#file-foto').alt = 'fotos/' + e.descripcion;
                document.querySelector('#title-foto').innerHTML = e.nombre;
                document.querySelector('#numComentarios-foto').innerHTML = e.ncomentarios;
                document.querySelector('#autor-foto').innerHTML = '<a href="buscar.html?l=' + e.login + '">' + e.login + '<img src="fotos/usuarios/' + e.foto_autor + '" width="20"></a>';


                aux += `<span class="">Dificultad: </span><span id="dificultad-foto">${e.dificultad}</span>`;
                document.querySelector('#colorDif').innerHTML = aux;
                auxTime += `<span class="">Tiempo para compoletar la ruta: </span><span id="tiempo-foto">${e.tiempo}</span>`;
                document.querySelector('#colorTiempo').innerHTML = auxTime;
                auxDate += `<span class="">fecha de subida de la ruta: </span><span id="fecha-foto">${e.fecha_hora}</span>`;
                document.querySelector('#colorFecha').innerHTML = auxDate;

                if (e.ruta_favorita > 0) { //Sí LA HA MARCADO
                    auxFav += `<span class="" onclick="disFav();">Favorita: </span><span id="numFavoritas-foto">${e.nfavoritas}</span>`;
                    document.querySelector('#colorFav').innerHTML = auxFav;
                    document.getElementById("colorFav").style.color = "blue";
                    document.getElementById("colorFav").style.cursor = "pointer";
                    //document.querySelector('#numFavoritas-foto').innerHTML = e.nfavorita;
                    //html += `<a href="#"><span style="color:blue;" class="icon-favourite"><span>${e.nfavorita}</span></span></a>`;
                }
                else { //NO LA HA MARCADO
                    auxFav += `<span class="" onclick="addFav();">Favorita: </span><span id="numFavoritas-foto">${e.nfavoritas}</span>`;
                    document.querySelector('#colorFav').innerHTML = auxFav;
                    document.getElementById("colorFav").style.color = "red";
                    document.getElementById("colorFav").style.cursor = "pointer";
                    //document.querySelector('#numFavoritas-foto').innerHTML = e.nfavorita;
                    //html += `<a href="#"><span class="icon-favourite"><span>${e.nfavorita}</span></span></a>`;
                }
            });
        },
        //TODO MAL:
        function (response) {
            console.log('ERROR');
        });
}



function rutaFotos() {
    if (window.location.search == "") {
        location.href = 'index.html';
    }
    var id_ruta = window.location.search;	//Extraigo el numero de id de la foto;
    id_ruta = id_ruta.split("?")[1];

    var url = 'api/rutas/' + id_ruta + '/fotos';

    fetch(url).then(
        //TODO OK:
        function (response) {
            if (!response.ok) {
                response.json().then(function (datos) {
                    console.log(datos);
                });
                return;
            }

            response.json().then(function (datos) {
                console.log(datos);
                let html = '';
                datos.FILAS.forEach(function (e) {
                    html += `<article>
								<img class="imgsRuta" src=fotos/rutas/${e.fichero} alt=${e.fichero}> </img>
								<p>Numero de foto: ${e.id}</p>
								<hr>
								<p>${e.texto}</p>
							</article>`
                });
                document.querySelector('#ruta-fotos').innerHTML = html;
            });
        },
        //TODO MAL:
        function (response) {
            console.log('ERROR');
        });

}

function ruta() {
    if (window.location.search == "") {
        location.href = 'index.html';
    }
    var id_ruta = window.location.search;	//Extraigo el numero de id de la foto;
    id_ruta = id_ruta.split("?")[1];
    let aux = '',
        auxFav = '',
        auxTime = '',
        auxDate = '';
    var url = 'api/rutas/' + id_ruta;
    //console.log(url);
    if (sessionStorage['pcw'] != null) { //Si el usuario SI esta logueado
        rutaLOG(url);
        //mostrarFormComentario();
        cargarForm();
    }
    fetch(url).then(
        //TODO OK:
        function (response) {
            if (!response.ok) {
                response.json().then(function (datos) {
                    console.log(datos);
                });
                return;
            }

            response.json().then(function (datos) {
                console.log(datos);
                let e = datos.FILAS[0];
                let html = '';
                //console.log(e);

                //Info basica
                document.querySelector('#file-foto').src = 'fotos/rutas/' + e.imagen;
                document.querySelector('#file-foto').alt = 'fotos/' + e.descripcion;
                document.querySelector('#title-foto').innerHTML = e.nombre;
                document.querySelector('#numComentarios-foto').innerHTML = e.ncomentarios;
                document.querySelector('#autor-foto').innerHTML = '<a href="buscar.html?l=' + e.login + '">' + e.login + '<img src="fotos/usuarios/' + e.foto_autor +'" width="20"></a>';


                aux += `<span class="">Dificultad: </span><span id="dificultad-foto">${e.dificultad}</span>`;
                document.querySelector('#colorDif').innerHTML = aux;
                auxFav += `<span class="icon-favourite">Favorita: </span><span id="numFavoritas-foto">${e.nfavoritas}</span>`;
                document.querySelector('#colorFav').innerHTML = auxFav;
                auxTime += `<span class="">Tiempo para compoletar la ruta: </span><span id="tiempo-foto">${e.tiempo}</span>`;
                document.querySelector('#colorTiempo').innerHTML = auxTime;
                auxDate += `<span class="">fecha de subida de la ruta: </span><span id="fecha-foto">${e.fecha_hora}</span>`;
                document.querySelector('#colorFecha').innerHTML = auxDate;
            });
        },
        //TODO MAL:
        function (response) {
            console.log('ERROR');
        });
}


//----------------------------------------------------Empiezo lo de mostrar comentarios de la ruta----------------------
function rutaComentarios() { //Muestra todos los comentarios que tiene la ruta
    if (window.location.search.split("html")[0] == "") {
        location.href = 'index.html';
    }

    var id_ruta = window.location.search;	//Extraigo el numero de id de la ruta;
    id_ruta = id_ruta.split("?")[1];

    var url = 'api/rutas/' + id_ruta + '/comentarios';

    fetch(url).then(
        //TODO OK:
        function (response) {
            if (!response.ok) {
                response.json().then(function (datos) {
                    console.log(datos);
                });
                return;
            }

            response.json().then(function (datos) {
                console.log(datos);
                let html = '';

                datos.FILAS.forEach(function (e) {
                    html += `<article>
								<p>${e.fecha_hora}</p>
								<p>${e.texto}</p>
								<hr>
								<p>${e.login} <img class="imgUsuPerfil" src="fotos/usuarios/${e.foto_autor}"></img></p>
							</article>`
                });
                document.querySelector('#photo-comments').innerHTML = html;
            });
        },
        //TODO MAL:
        function (response) {
            console.log('ERROR');
        });
}

function cargarForm() {
    let xhr = new XMLHttpRequest(),
        url = 'commentForm.html';

    xhr.open('GET', url, true);
    xhr.onload = function () {
        document.getElementById("comentarios_logueado").innerHTML = '';
        document.querySelector('#formulario_comentarios').innerHTML = xhr.responseText;
    };
    xhr.send();
}

function addFav() {
    if (sessionStorage['pcw'] != null) { //Si el usuario SI esta logueado
        let usu = JSON.parse(sessionStorage['pcw']),
            auth = usu.login + ':' + usu.token,
            xhr = new XMLHttpRequest(),
            idRuta = location.search.substring(1),
            url = `api/rutas/${idRuta}/favorita/true`;

        xhr.open('POST', url, true);
        xhr.onload = function () {
            let r = JSON.parse(xhr.responseText);
            if (r.RESULTADO == 'OK') {
                console.log("Se ha marcado como Favorita.");
                rutaLOG()
            }
        };
        xhr.setRequestHeader('Authorization', auth);
        xhr.send();
    }
}

function disFav() {
    if (sessionStorage['pcw'] != null) {
        let usu = JSON.parse(sessionStorage['pcw']),
            auth = usu.login + ':' + usu.token,
            xhr = new XMLHttpRequest(),
            idRuta = location.search.substring(1),
            url = `api/rutas/${idRuta}/favorita/false`;

        xhr.open('POST', url, true);
        xhr.onload = function () {
            let r = JSON.parse(xhr.responseText);
            if (r.RESULTADO == 'OK') {
                console.log("Se ha DESmarcado como Favorita.");
                rutaLOG();
            }
        };
        xhr.setRequestHeader('Authorization', auth);
        xhr.send();
    }
}

function addComment(frm) {
    if (sessionStorage['pcw'] != null) { //Si el usuario SI esta logueado
        let usu = JSON.parse(sessionStorage['pcw']),
            auth = usu.login + ':' + usu.token,
            xhr = new XMLHttpRequest(),
            idRuta = location.search.substring(1),
            url = `api/rutas/${idRuta}/comentario`,
            fd = new FormData(frm);

        xhr.open('POST', url, true);
        xhr.onload = function () {
            let r = JSON.parse(xhr.responseText);
            if (r.RESULTADO == 'OK') {
                console.log("Se ha guardado el comentario.");
                mostrarMensaje();
                ifComment = true;

                rutaComentarios();
            }
            else {
                console.log("NO se ha podido guardar el comentario.");
                mostrarMensajeError();
                ifComment = false;
            }
        };
        xhr.setRequestHeader('Authorization', auth);
        xhr.send(fd);
        return false;
    }
}

//******************************************* PAGINACION **************************
function Next() {
    if (document.body.getAttribute('data-pagina') == 'index') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) < parseInt(document.querySelector('#maxPag').innerHTML)) {
            MuestraFotosIndex((parseInt(document.querySelector('#actualPag').innerHTML)));
            document.querySelector('#actualPag').innerHTML++;
        }
    }
    else if (document.body.getAttribute('data-pagina') == 'buscar') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) < parseInt(document.querySelector('#maxPag').innerHTML)) {
            buscarLOGorNot((parseInt(document.querySelector('#actualPag').innerHTML)));
            document.querySelector('#actualPag').innerHTML++;
        }
    }
}
function First() {
    if (document.body.getAttribute('data-pagina') == 'index') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) > 1) {
            document.querySelector('#actualPag').innerHTML = 1;
            MuestraFotosIndex(0);
        }
    }
    else if (document.body.getAttribute('data-pagina') == 'buscar') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) > 1) {
            document.querySelector('#actualPag').innerHTML = 1;
            buscarLOGorNot(0);
        }
    }
}
function Previous() {
    if (document.body.getAttribute('data-pagina') == 'index') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) > 1) {
            document.querySelector('#actualPag').innerHTML--;
            MuestraFotosIndex((parseInt(document.querySelector('#actualPag').innerHTML)) - 1);
        }
    }
    else if (document.body.getAttribute('data-pagina') == 'buscar') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) > 1) {
            document.querySelector('#actualPag').innerHTML--;
            buscarLOGorNot((parseInt(document.querySelector('#actualPag').innerHTML)) - 1);
        }
    }
}
function Last() {
    if (document.body.getAttribute('data-pagina') == 'index') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) < parseInt(document.querySelector('#maxPag').innerHTML)) {
            document.querySelector('#actualPag').innerHTML = document.querySelector('#maxPag').innerHTML;
            MuestraFotosIndex((parseInt(document.querySelector('#actualPag').innerHTML) - 1));
        }
    }
    else if (document.body.getAttribute('data-pagina') == 'buscar') {
        if (parseInt(document.querySelector('#actualPag').innerHTML) < parseInt(document.querySelector('#maxPag').innerHTML)) {
            document.querySelector('#actualPag').innerHTML = document.querySelector('#maxPag').innerHTML;
            buscarLOGorNot((parseInt(document.querySelector('#actualPag').innerHTML) - 1));
        }
    }
}
function numeroDePaginas() {
    var totalPaginas;
    let url = 'api/rutas/?pag=0&lpag=6';
    fetch(url).then(
        function (response) {
            if (!response.ok) {
                response.json().then(function (datos) {
                    //console.log(datos);
                });
                return;
            }
            response.json().then(function (datos) {
                //console.log(datos.TOTAL_COINCIDENCIAS);
                totalPaginas = datos.TOTAL_COINCIDENCIAS / 6;
                totalPaginas = Math.ceil(totalPaginas);
                document.querySelector('#maxPag').innerHTML = totalPaginas;
            });
        },
        //All Bad:
        function (response) {
            console.log('ERROR');
        });
}