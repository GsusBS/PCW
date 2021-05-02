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
function pedirRutasIndex() {
    let xhr = new XMLHttpRequest(),
        url = 'api/get/rutas.php';

    xhr.open('GET', url, true);

    xhr.onload = function () {
        let v = JSON.parse(xhr.responseText),
            html = '';
        console.log(v);

        /* html += '<ul>';
        v.FILAS.forEach(function (e,idx) {
            html += '<li>Ruta nº ${idx}: ${e.nombre}</li>';
        });

        html += '</ul>'; */
        v.FILAS.forEach(function (e, idx) {
            html += `
                <article>
                <h3>Ruta nº ${idx + 1}</h2>
                <h2>${e.nombre}</h2>
                            <a href="ruta.html?${idx}"><img src="fotos/rutas/${e.imagen}" alt="Foto de la ruta ${idx + 1}"></a>
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
                <h2>TITULO DEL MENSAJE</h2>
                <p>Texto del mensaje de prueba</p>
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

