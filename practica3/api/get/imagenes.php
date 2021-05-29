<?php
// FICHERO: api/get/imagenes.php
// PETICIONES GET ADMITIDAS:
//   api/imagenes -> devuelve la lista de imágenes en la base de datos
//   api/imagenes/{ID_IMAGEN} -> devuelve la información de la imagen cuyo id se proporciona

// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
// =================================================================================
require_once('../database.php');
// instantiate database and product object
$db    = new Database();
$dbCon = $db->getConnection();
// =================================================================================
// RECURSO
// =================================================================================
if(strlen($_GET['prm']) > 0)
    $RECURSO = explode("/", substr($_GET['prm'],1));
else
    $RECURSO = [];
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = [];  // Almacenará el resultado.
// =================================================================================
// Se prepara el sql
$mysql = 'select * from imagen';
// =================================================================================
// Si viene el id de la imagen en la petición, se utiliza
$ID = array_shift($RECURSO); // Se comprueba si se proporciona el id del registro
if(is_numeric($ID))
    $mysql .= ' where id=' . $ID;
$stmt  = $dbCon->prepare($mysql);
if($stmt->execute()) // execute query
{
  $RESPONSE_CODE  = 200; // código de respuesta por defecto: 200 - OK
  $R['RESULTADO'] = 'OK';

  while( $row = $stmt->fetch(PDO::FETCH_ASSOC) )
    $FILAS[] = $row;

  $stmt->closeCursor();
  $R['FILAS'] = $FILAS; // Se añade la lista de imágenes de la BD
}
else
{
  $RESPONSE_CODE    = 500;
  $R['RESULTADO']   = 'ERROR' ;
  $R['DESCRIPCION'] = 'Se ha producido un error en el servidor al ejecutar la consulta.';
}
// SE AÑADE EL CÓDIGO DE RESULTADO DE LA PETICIÓN
$R = ['CODIGO' => $RESPONSE_CODE] + $R;
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