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
function pedirDatos() {
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
                            <a href="ruta.html"><img src="fotos/rutas/${e.imagen}" alt="Foto de la ruta ${idx + 1}"></a>
                                <figcaption>${e.nombre}</figcaption>
                            </img>
                            <p>Dificultad: 2</p>
                    <footer>
                        <p>Autor: <a href="buscar.html">Jesus Bernabeu </a>
                            <p> <time datetime="2017-02-14 0:00">Fecha: 2017-02-14</time></p>
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


function hacerLogout(){

    let url = 'api/post/usuarios/logout.php',
        xhr = new XMLHttpRequest(),
        usu,clave;

        if(!sessionStorage['pcw'])
            return;

        usu = JSON.parse(sessionStorage['pcw']);
        clave = usu.login + ':' + usu.token;

        xhr.open('POST', url, true);

        xhr.onload=function() {
            console.log(xhr.responseText);
            let r = JSON.parse(xhr.responseText);
            if(r.RESULTADO == "OK")
                sessionStorage.removeItem('pcw');
        };

        xhr.setRequestHeader('authorization', clave);
        xhr.send();
}

function mostrarImagen(inp) {
    let fr = new FileReader();

    //if(!inp.files[0])
    if(inp.files.length < 1)
        return;

    fr.onload = function(){
        inp.parentNode.querySelector('img').src = fr.result;
    };

    fr.readAsDataURL(inp.files[0]);
}

function enviarFoto()
{
    let inp = document.querySelector('#fichero'),
        fd =  new FormData(),
        url = 'api/rutas/2/foto',
        usu = JSON.parse(sessionStorage['pcw']),
        xhr = new XMLHttpRequest();

        // envio la foto
        fd.append('fichero', inp.files[0]);
        //  añado texto
        fd.append('texto', inp.parentNode.querySelector('textarea').value);

        xhr.open('POST', url, true);

        xhr.onload = function(){
            console.log(xhr.responseText);
        }

        xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);

        xhr.send(fd);

}

function pedirRutas(){
    let url = 'api/rutas';

    fetch(url).then(function(response){
        if(response.ok)
        {

        }
        else{
            console.log('Error ' + response.status + ': ' response.statusText);
        }
    });
}