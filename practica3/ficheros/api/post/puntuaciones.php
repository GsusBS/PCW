<?php
// FICHERO: api/post/puntuaciones.php
// PETICIONES POST ADMITIDAS:
// * api/puntuaciones -> Dar de alta una nueva puntuación
//       Params: nombre:Nombre del jugador;dificultad:dificultad empleada;jugadas:jugadas (intercambios) realizados
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
// =================================================================================
require_once('../database.php');
// instantiate database and product object
$db    = new Database();
$dbCon = $db->getConnection();
// La instrucción siguiente es para poder recoger tanto errores como warnings que
// se produzcan en las operaciones sobre la BD (funciondes php errorCode() y errorInfo())
$dbCon->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// SE COGEN LOS PARÁMETROS DE LA PETICIÓN
// =================================================================================
$PARAMS = $_POST;

try{
  if(isset($PARAMS['id_imagen']) && isset($PARAMS['nombre']) && isset($PARAMS['dificultad']) && isset($PARAMS['jugadas']) )
  {
    $mysql  = "insert into puntuacion(id_imagen,usuario,dificultad,jugadas) ";
    $mysql .= "values(:ID_IMAGEN,:NOMBRE,:DIFICULTAD,:JUGADAS)";
    // Parámetros de la petición
    $VALORES                = [];
    $VALORES[':ID_IMAGEN']  = $PARAMS['id_imagen'];
    $VALORES[':NOMBRE']     = $PARAMS['nombre'];
    $VALORES[':DIFICULTAD'] = $PARAMS['dificultad'];
    $VALORES[':JUGADAS']    = $PARAMS['jugadas'];

    $dbCon->beginTransaction();

    $stmt = $dbCon->prepare($mysql);
    if( $stmt->execute($VALORES) )
    {
      $RESPONSE_CODE    = 201;
      $R['RESULTADO']   = 'OK';
      $R['CODIGO']      = $RESPONSE_CODE;
      $R['DESCRIPCION'] = 'Puntuación guardada correctamente';
    }
    else
    {
      $RESPONSE_CODE    = 500;
      $R['RESULTADO']   = 'ERROR';
      $R['CODIGO']      = $RESPONSE_CODE;
      $R['DESCRIPCION'] = 'Error de servidor.';
    }
    $dbCon->commit();
  }
  else
  {
    $RESPONSE_CODE    = 400;
    $R['RESULTADO']   = 'ERROR';
    $R['CODIGO']      = $RESPONSE_CODE;
    $R['DESCRIPCION'] = 'Faltan parámetros en la petición';
  }
}catch(Exception $e){
  $dbCon->rollBack();
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