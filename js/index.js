

function puzzleStart() {

    let xhr = new XMLHttpRequest();

    let url = './api/sudoku/generar/';
    let tam = document.getElementById("selectTam").value;
    url += tam;

    html = '';
    html += `<button id="btnError" class="btn">Errores</button>`;
    html += `<output class="crono" id="crono">00:00:00</output>`;
    html += `<button id="btnFinal" class="btn" onclick="finalizarBtn();">Finalizar</button>`;




    xhr.open('POST', url, true);


    xhr.onload = function(){

        let r = JSON.parse(xhr.responseText);

            if(r.RESULTADO == 'OK'){

                sessionStorage.setItem('infoArray', r.SUDOKU);
                sessionStorage.setItem('tam',tam);
                sessionStorage.setItem('sudoku', r.TOKEN);
                sessionStorage.setItem('id', r.ID);

                console.log(r);


            }

            document.getElementById('btnStart').innerHTML = html;
            refresca();
            pintarTabla();
            ocultarTam();
            init();
            interactCV();


    };
       xhr.send();
  }


  function finalizarBtn(){



    let xhr = new XMLHttpRequest();

    let url = 'api/sudoku/' + sessionStorage['id'];      // URL
    let autorizacion = sessionStorage['sudoku'];

    console.log(url);

    xhr.open('DELETE', url, true);


    xhr.onload = function(){

        let r = JSON.parse(xhr.responseText);

            if(r.RESULTADO == 'OK'){

                sessionStorage.removeItem('sudoku');
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('tam');
                sessionStorage.removeItem('infoArray');
                location.href = './index.html';

                console.log(r);


            }



    };

    xhr.setRequestHeader('Authorization', autorizacion);
    xhr.send();



}






  function crearBotonStart(){


    html = '';

    html = `<button id="startButton" class="btn" onclick="puzzleStart();">Empezar</button>`;

    document.getElementById('btnStart').innerHTML = html;

  }

  function pintarClickBorde(c,cellHeight,fila,columna){
    let ctx = c.getContext('2d');

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#18143F";
    ctx.strokeRect(columna*cellHeight,fila*cellHeight,cellHeight,cellHeight);
    ctx.stroke();

  }


  function pintarClickAzul(c,cellHeight,r,tam,fila,columna,num){

    let ctx = c.getContext('2d');
    let nume=0;

    ctx.fillStyle = "#A0D4FD";
    //console.log("click ",columna," ",fila);

    for(ri=0;ri<tam;ri++){     // tam = 10
      for(ci=0;ci<tam;ci++){
        if(ri == fila || ci == columna){

          if(r[nume] == 0){
            ctx.fillRect(ci*cellHeight,ri*cellHeight,cellHeight,cellHeight);
            //console.log("// ",ci," ",fila," ",r[nume]);



          }

        }
        nume=nume+1;
      }
    }
    ctx.fillStyle = "#008FFF";
    ctx.fillRect(columna*cellHeight,fila*cellHeight,cellHeight,cellHeight);

  }





  function pintarAzul(c,cellHeight,r,tam,fila,columna){

    let ctx = c.getContext('2d');
    let num=0;

    ctx.fillStyle = "#008FFF";
    ctx.fillRect(columna*cellHeight,fila*cellHeight,cellHeight,cellHeight);
    //console.log("mouse: ",fila," ",columna);
  }

  function pintarGris( ctx, tam,r,cellHeight){
    let num = 0;
    let y=0;
    let x=0;


      for(ri=0;ri<tam;ri++){     // tam = 10
        for(ci=0;ci<tam;ci++){ 	// tam = 9



          if(r[num] != 0){
            ctx.fillStyle = "#D4D3DD";
            x=ci*cellHeight;
            y=ri*cellHeight;
            //console.log("Numero de ",x," ",y," ",r[num]," // ",cellHeight);
            ctx.fillRect(x,y,cellHeight,cellHeight);

          }
          num = num + 1;
          ctx.fillStyle=ctx.fillStyle+1;
        }
      }
  }

  function pintarNum( ctx, tam,r,cellHeight){
    let num = 0;


      for(ri=1;ri<tam+1;ri++){     // tam = 10
        for(ci=0;ci<tam;ci++){ 	// tam = 9
          ctx.fillStyle = "#000000";
          ctx.font = "30px Arial";

          if(r[num] != 0){

            ctx.fillText(r[num], (ci*cellHeight)+cellHeight/Math.sqrt(tam), (ri*cellHeight)-(cellHeight/Math.sqrt(tam))+4);

          }
          num = num + 1;
        }
      }
  }

  function pintarTabla(){

    let tam =   sessionStorage['tam'];

    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvasLength = 0;

    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");



    canvasLength = w >= h ? h/2 : w/2;
    c.width = canvasLength;
    c.height = canvasLength;

    let cellHeight = canvasLength/tam; // Longitud de una celda

    for(i=1;i<=8;i++){
      //Pintado de líneas horizontales
      ctx.beginPath();
      ctx.moveTo(0, cellHeight*i);
      if(i % Math.sqrt(tam) == 0){
        ctx.lineWidth = 4;
      }else{
        ctx.lineWidth = 1;
      }
      ctx.lineTo(canvasLength, cellHeight*i);
      ctx.stroke();

      //Pintado de líneas verticales
      ctx.beginPath();
      ctx.moveTo(cellHeight*i, 0);
      ctx.lineTo(cellHeight*i, canvasLength);
      ctx.lineWidth = 1;
      if(i % Math.sqrt(tam) == 0){
        ctx.lineWidth = 4;
      }else{
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }

    if(sessionStorage.getItem('infoArray') != null){

        let r = sessionStorage.getItem('infoArray').split(",");

        pintarGris(ctx,tam,r,cellHeight);

        pintarNum(ctx,tam,r,cellHeight);

    }

  }


  function init() {
    cronos = setInterval(function() { timer() }, 1000);
  }

  function timer() {
    tiempo = parseInt(document.querySelector('#crono').value);
    document.querySelector('#crono').value = eval(tiempo + 1);
  }

  function crearCanvasTam(){

    let tam = 0;


    if(document.getElementById("selectTam").value == 9){
      tam=9;
      sessionStorage.setItem('tam',9);
    }
    else{
      tam=4;
      sessionStorage.setItem('tam',4);
    }

    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvasLength = 0;

    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");

    /*
    La longitud del canvas será la mitad de la anchura o altura de la ventana disponible
    */
    canvasLength = w >= h ? h/2 : w/2;
    c.width = canvasLength;
    c.height = canvasLength;

    let cellHeight = canvasLength/tam; // Longitud de una celda

    for(i=1;i<=8;i++){
      //Pintado de líneas horizontales
      ctx.beginPath();
      ctx.moveTo(0, cellHeight*i);
      if(i % Math.sqrt(tam) == 0){
        ctx.lineWidth = 4;
      }else{
        ctx.lineWidth = 1;
      }
      ctx.lineTo(canvasLength, cellHeight*i);
      ctx.stroke();

      //Pintado de líneas verticales
      ctx.beginPath();
      ctx.moveTo(cellHeight*i, 0);
      ctx.lineTo(cellHeight*i, canvasLength);
      ctx.lineWidth = 1;
      if(i % Math.sqrt(tam) == 0){
        ctx.lineWidth = 4;
      }else{
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }


  }

  function ocultarTam(){

    let html = ''
    document.getElementById('numTam').innerHTML = html;
  }


  function refresca(){
    let c = document.getElementById('myCanvas');
    let num=0;

    let ctx = c.getContext('2d');
    if(sessionStorage['tam'] == 9){
      tam = 9;
    }else{
      tam = 4;
    }

    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvasLength = 0;
    canvasLength = w >= h ? h/2 : w/2;
    c.width = canvasLength;
    c.height = canvasLength;

    let cellHeight = canvasLength/tam;

    for(let ri=1;ri<tam+1;ri++){     // tam = 10
      for(let ci=0;ci<tam;ci++){
        ctx.beginPath();
        if(sessionStorage.getItem('infoArray') != null){

          let r = sessionStorage.getItem('infoArray').split(",");
          if(r[num]==0){
            ctx.fillStyle='#ffffff';
            ctx.fillRect(ci*cellHeight,ri*cellHeight,cellHeight,cellHeight);
          }
          else{
            ctx.fillText(r[num], (ci*cellHeight)+cellHeight/Math.sqrt(tam), (ri*cellHeight)-(cellHeight/Math.sqrt(tam))+4);
            pintarGris(ctx,tam,r,cellHeight);
            pintarNum(ctx,tam,r,cellHeight);

            //console.log("Numero de ",r[num]," // ",ci," ",ri);
          }

          num = num + 1;
        }
      }
    }

  }

  function actualizarCrono(){

    if(document.querySelector('#crono').getAttribute('data-parar'))
    return false;



    let valor = parseInt(document.querySelector('#crono').getAttribute('data-valor')) + 1,
        horas = Math.floor(valor / 3600),
        minutos = Math.floor((valor - horas * 3600) / 60),
        segundos = valor - horas * 36000 - minutos * 60;

        horas = (horas < 10?'0':'') + horas;
        minutos = (minutos < 10?'0':'') + minutos;
        segundos = (segundos < 10?'0':'') + segundos;

    document.querySelector('#crono').innerHTML = `${horas}:${minutos}:${segundos}`;
    document.querySelector('#crono').setAttribute = ('data-valor', valor);
    setTimeout(actualizarCrono, 1000);


  }

  function iniciarCrono(){

    document.querySelector('#crono').innerHTML = '00:00:00';
    document.querySelector('#crono').setAttribute('data-valor', '0');
    document.querySelector('#crono').removeAttribute('data-parar');
    setTimeout(actualizarCrono, 1000);

  }

  function pararCrono(){

    document.querySelector('#crono').setAttribute('data-parar', 'si');

  }



  function interactCV(){

    let tam =   sessionStorage['tam'];
    //console.log("tam",tam);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvasLength = 0;

    let c = document.getElementById('myCanvas');


    canvasLength = w >= h ? h/2 : w/2;
    c.width = canvasLength;
    c.height = canvasLength;

    let cellHeight = canvasLength/tam;
    let num=0;
    c.onmousemove = function(evt){
      if(evt.offsetX<0 || evt.offsetX>412 || evt.offsetY<0 || evt.offsetY>412){
        return false;
      }
      let fila, columna;

      fila=Math.trunc(evt.offsetY/cellHeight);
      columna = Math.trunc(evt.offsetX/cellHeight);
      if(sessionStorage.getItem('infoArray') != null){
        let r = sessionStorage.getItem('infoArray').split(",");

        if(r[(fila*tam)+columna] == 0){
          refresca();
          pintarTabla();
          pintarAzul(c,cellHeight,r,tam,fila,columna);

        }


      }


    }

    c.onclick = function (evt){

      let tiene = false;

        if(evt.offsetX<0 || evt.offsetX>412 || evt.offsetY<0 || evt.offsetY>412){
          return false;
        }


      let fila, columna;

      fila=Math.trunc(evt.offsetY/cellHeight);
      columna = Math.trunc(evt.offsetX/cellHeight);



      if(sessionStorage.getItem('infoArray') != null){
        let r = sessionStorage.getItem('infoArray').split(",");
        num=(fila*tam)+columna;

        if(r[num] == 0){
          pintarTabla();
          pintarClickAzul(c,cellHeight,r,tam,fila,columna,num);
          pintarClickBorde(c,cellHeight,fila,columna);

        }

      }



    }


  }


// Parte 2021
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

var array9x9 = [
  [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
  [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8],
  [2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
  [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8],
  [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8],
  [5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8],
  [6.0, 6.1, 6.2, 6.3, 6.4, 6.6, 6.6, 6.7, 6.8],
  [7.0, 7.1, 7.2, 7.3, 7.4, 7.7, 7.6, 7.7, 7.8],
  [8.0, 8.1, 8.2, 8.3, 8.4, 8.8, 8.6, 8.7, 8.8]
];

function inicioprueba() {


  console.log("Antes ", array9x9);
  randomArray(array9x9);
  console.log("Despues", array9x9);
}

function inicio(){
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var img2= document.getElementById("foto");
  //ctx.drawImage(img,0,0);
  var img2=[27,32,26,28];
 var map = ctx.getImageData(0,0,400,400);
 map.data.set( new Uint8ClampedArray(img2));
 var imdata = map.data;
 var arrayF;

 for(var i=0; i<400; i+=1){
   for(var j=0; j<400; j+=1){
     arrayF[i][j] = imdata[i][j];
   }
 }
  ctx.putImageData(map,0,0);

}


function randomArray(array) {

  for (var i = 0; i < array.length ; i++) {
    for (var j = 0; j < array[i].length ; j++) {
      var i1 = Math.floor(Math.random() * (array.length));
      var j1 = Math.floor(Math.random() * (array.length));

      var temp = array[i][j];
      array[i][j] = array[i1][j1];
      array[i1][j1] = temp;
    }
  }
}
