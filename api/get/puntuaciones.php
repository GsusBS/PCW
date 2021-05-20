<?php
// FICHERO: api/get/puntuaciones.php
// PETICIONES GET ADMITIDAS:
//   api/puntuaciones -> devuelve la lista de puntuaciones en la base de datos
// ORDEN
//   Para especificar el orden se añade el parámetro ord con el orden a aplicar (i=imagen, d=dificultad, j=jugadas, f=fecha). Se pueden combinar varios órdenes separados por comas. Por defecto, el orden es ascendente y se puede cambiar añadiendo a la letra de campo 'd' para descendente
//   Por ejemplo:
//     api/puntuaciones?ord=i -> devuelve los datos ordenados por imagen ascendente
//     api/puntuaciones?ord=i,dd,ja -> devuelve los datos ordenados por imagen ascendente, dificultad descendente y número de jugadas ascendente. La letra 'a' para ascendente es optativa.
// PAGINACIÓN
//   api/puntuaciones?pag={página}&lpag={número de registros por página} -> devuelve los registros que están en la página que se le pide, tomando como tamaño de página el valor de lpag. Por ejemplo: api/puntuaciones?pag=0&lpag=5
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
// =================================================================================
require_once('../database.php');
// instantiate database and product object
$db    = new Database();
$dbCon = $db->getConnection();
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se pillan los parámetros de la petición
// =================================================================================
$PARAMS = array_slice($_GET, 1, count($_GET) - 1,true);
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = [];  // Almacenará el resultado.
// =================================================================================
$mysql = 'select p.*,i.nombre,i.fichero from puntuacion p, imagen i where p.id_imagen=i.id';

// =================================================================================
// ORDEN A APLICAR EN LOS REGISTROS
// =================================================================================
// Cuando se especifican los dos órdenes, primero se aplica el orden por dificultad
// y luego el orden por duración de la ruta (tiempo)
if(isset($PARAMS['ord'])) // se especifica orden
{
    $clausula_order = ' order by ';
    $orden          = explode(",", $PARAMS['ord']);

    for($i=0;$i<count($orden); $i++)
    {
        switch (substr($orden[$i], 0, 1)) {
            case 'i': // imagen
                    $clausula_order .= 'fichero';
                break;
            case 'd': // dificultad
                    $clausula_order .= 'dificultad';
                break;
            case 'j': // número de jugafas
                    $clausula_order .= 'jugadas';
                break;
            case 'f': // fecha
                    $clausula_order .= 'fecha_hora';
                break;
        }

        if(strlen($orden[$i]) > 1) // lleva orden implícito
            $clausula_order .= (substr($orden[$i], 0, 1)=='d')?' desc':' asc';
        $clausula_order .= ',';
    }
    $mysql .= substr($clausula_order, 0, strlen($clausula_order) - 1);
}

if(isset($PARAMS['ot'])) // ordenado por tiempo
{
    if($PARAMS['ot'] == 'asc' || $PARAMS['ot'] == 'desc')
    {
        if(isset($PARAMS['od']) && ($PARAMS['od'] == 'asc' || $PARAMS['od'] == 'desc'))
            $mysql .= ',';
        else
            $mysql .= ' order by ';
        $mysql .= 'r.tiempo ' . $PARAMS['ot'];
    }
}

// =================================================================================
// CONSTRUIR LA PARTE DEL SQL PARA PAGINACIÓN
// =================================================================================
if(isset($PARAMS['pag']) && is_numeric($PARAMS['pag'])      // Página a listar
    && isset($PARAMS['lpag']) && is_numeric($PARAMS['lpag']))   // Tamaño de la página
{
    $pagina           = $PARAMS['pag'];
    $regsPorPagina    = $PARAMS['lpag'];
    $ELEMENTO_INICIAL = $pagina * $regsPorPagina;
    $SQL_PAGINACION   = ' LIMIT ' . $ELEMENTO_INICIAL . ',' . $regsPorPagina;
    // =================================================================================
    // Para sacar el total de coincidencias que hay en la BD:
    // =================================================================================
    $stmt  = $dbCon->prepare($mysql);
    $stmt->execute(); // execute query
    $TOTAL_COINCIDENCIAS = $stmt->rowCount();
    $stmt->closeCursor();
    $mysql .= $SQL_PAGINACION;
}
else
    $TOTAL_COINCIDENCIAS = -1;
// =================================================================================
// SE HACE LA CONSULTA
// =================================================================================
$stmt = $dbCon->prepare($mysql);

if($stmt->execute()) // execute query OK
{
    $RESPONSE_CODE  = 200;
    $R['RESULTADO'] = 'OK';
    $R['CODIGO']    = $RESPONSE_CODE;
    $FILAS          = [];

    if($TOTAL_COINCIDENCIAS > -1)
    {
        $R['TOTAL_COINCIDENCIAS']  = $TOTAL_COINCIDENCIAS;
        $R['PAGINA']               = $pagina;
        $R['REGISTROS_POR_PAGINA'] = $regsPorPagina;
    }
    while( $row = $stmt->fetch(PDO::FETCH_ASSOC) )
        $FILAS[] = $row;

    $stmt->closeCursor();
    $R['FILAS'] = $FILAS;
}
else
{
    $RESPONSE_CODE    = 500;
    $R['CODIGO']      = $RESPONSE_CODE;
    $R['RESULTADO']   = 'ERROR' ;
    $R['DESCRIPCION'] = 'Se ha producido un error en el servidor al ejecutar la consulta.';
}
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
$dbCon = null;
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
echo json_encode($R);
?>