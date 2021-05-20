class juego (dificultad, imagen){

    trozofotos = dificultad;

    contruirTrozofotos(trozofotos){

    }
}

class torzoFoto{

    imgRecortada=asdfas.png

    posActual[][]=[random1][random2];
    posCorrecta[][]=[random1][random2];

    bool asignado=(this.posCorrecta==this.posActual);

    seleccionada= false;

    comprobarTrozofotos(trozoFoto2){
        if (this.posCorrecta[][] == trozoFoto2.posActual[][])
            this.asignado= true;
        if (trozoFoto2.posCorrecta[][] == this.posActual[][])
            trozoFoto2.asignado = true;
        //hacerlo con

        this.posActual[][] = trozoFoto2.posActual[][];
    }
    pincharFoto(){
        seleccionada=true
    }

}