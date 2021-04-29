<?php
// FICHERO: api/post/rutas.php
// PETICIONES POST ADMITIDAS:
// Nota: Todas las operaciones deberán añadir a la petición POST una cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}".
// * api/rutas -> Dar de alta una nueva ruta
//       Params: nombre:Nombre de la ruta;descripcion:descripción;dificultad:dificultad de la ruta;tiempo:tiempo necesario para realizar la ruta

// * api/rutas/{ID}/foto   -> Da de alta una foto para la ruta. Necesita la cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}".
//       Params: fichero:foto del artículo (input type=file); texto:texto asociado a la foto
// * api/rutas/{ID}/favorita/{ACCION} -> Marca la ruta como favorita. Necesita la cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}". Si {ACCION}==true, marca para seguir, si no, para dejar de seguir
// * api/rutas/{ID}/comentario  -> Permite añadir un comentario a la ruta. Necesita la cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}".
//       Params: texto: texto del comentario
//
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
$RECURSO = explode("/", substr($_GET['prm'],1));
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// =================================================================================
// =================================================================================
// FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================
// Subir una foto
function subirFoto($ID, $texto, $FICHERO)
{
  global $dbCon, $pathFotos;

  $mysql = 'insert into foto(id_ruta, texto) values(:ID_RUTA,:TEXTO);';

  $VALORES             = [];
  $VALORES[':ID_RUTA'] = $ID;
  $VALORES[':TEXTO']   = $texto;

  $stmt2 = $dbCon->prepare($mysql);
  if( $stmt2->execute($VALORES) )
  {
    $mysql = 'select max(ID) as id_fichero from foto';
    $stmt3 = $dbCon->prepare($mysql);
    if( $stmt3->execute() )
    {
      $row = $stmt3->fetch(PDO::FETCH_ASSOC);
      $stmt3->closeCursor();
      $ID_FICHERO = $row['id_fichero'];

      $ext = pathinfo($FICHERO['name'], PATHINFO_EXTENSION); // extensión del fichero
      $uploaddir = '../../' . $pathFotos . 'rutas/';
      $uploadfile = $uploaddir . $ID_FICHERO . '.' . $ext; // path fichero destino

      // Se crea el directorio si no existe
      if (!file_exists($uploaddir)) {
        mkdir($uploaddir, 0777, true);
      }
      if(move_uploaded_file($FICHERO['tmp_name'], $uploadfile)) // se sube el fichero
      {
        $mysql = 'update foto set fichero=:FICHERO where id=:ID_FICHERO';
        $VALORES                = [];
        $VALORES[':FICHERO']    = $ID_FICHERO . '.' . $ext;
        $VALORES[':ID_FICHERO'] = $ID_FICHERO;

        $RESPONSE_CODE    = 201;
        $R['RESULTADO']   = 'OK';
        $R['CODIGO']      = $RESPONSE_CODE;
        $R['DESCRIPCION'] = 'Foto subida correctamente';
      }
      else
      { // No se ha podido copiar la foto. Hay que eliminar el registro
        $mysql = 'delete from fichero where id=:ID_FICHERO';
        $VALORES[':ID_FICHERO'] = $ID_FICHERO;

        $RESPONSE_CODE    = 500;
        $R['RESULTADO']   = 'ERROR';
        $R['CODIGO']      = $RESPONSE_CODE;
        $R['DESCRIPCION'] = 'Error al guardar la foto';
      }
      // SE EJECUTA LA CONSULTA
      $stmt3 = $dbCon->prepare($mysql);
      if( !$stmt3->execute($VALORES) )
      {
        $RESPONSE_CODE    = 500;
        $R['RESULTADO']   = 'ERROR';
        $R['CODIGO']      = $RESPONSE_CODE;
        $R['DESCRIPCION'] = 'Error indefinido al guardar la foto';
      }
    }
  }
  else
  {
    $RESPONSE_CODE    = 500;
    $R['RESULTADO']   = 'ERROR';
    $R['CODIGO']      = $RESPONSE_CODE;
    $R['DESCRIPCION'] = 'Error indefinido al guardar la foto';
  }
  return $R;
}

// =================================================================================
// Se pillan las cabeceras de la petición y se comprueba que está la de autorización
// =================================================================================
$headers = apache_request_headers();
// CABECERA DE AUTORIZACIÓN
if(isset($headers['Authorization']))
    $AUTORIZACION = $headers['Authorization'];
elseif (isset($headers['authorization']))
    $AUTORIZACION = $headers['authorization'];

if(!isset($AUTORIZACION))
{ // Acceso no autorizado
  $RESPONSE_CODE    = 403;
  $R['RESULTADO']   = 'ERROR';
  $R['CODIGO']      = $RESPONSE_CODE;
  $R['DESCRIPCION'] = 'Falta autorización';
}
else
{
  // =================================================================================
  // Se prepara la respuesta
  // =================================================================================
  $R             = [];  // Almacenará el resultado.
  $RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
  // =================================================================================
  // =================================================================================
  // Se supone que si llega aquí es porque todo ha ido bien y tenemos los datos correctos
  // de la nueva entrada, NO LAS FOTOS. Las fotos se suben por separado una vez se haya
  // confirmado la creación correcta de la entrada.
  $PARAMS = $_POST;
  list($login,$token) = explode(':', $AUTORIZACION);

  if( !$db->comprobarSesion($login,$token) )
  {
    $RESPONSE_CODE    = 401;
    $R['RESULTADO']   = 'ERROR';
    $R['CODIGO']      = $RESPONSE_CODE;
    $R['DESCRIPCION'] = 'Error de autenticación.';
  }
  else
  {
    $ID = array_shift($RECURSO);
    try{
      $dbCon->beginTransaction();
      if(!is_numeric($ID)) // NUEVO REGISTRO
      { // Si no es numérico $ID es porque se está creando un nuevo registro
        $nombre      = $PARAMS['nombre'];
        $descripcion = nl2br($PARAMS['descripcion'],false);
        $dificultad  = $PARAMS['dificultad'];
        $tiempo      = $PARAMS['tiempo'];
        // =================================================================================
        $mysql  = 'insert into ruta(nombre,descripcion,dificultad,tiempo,login) ';
        $mysql .= 'values(:NOMBRE,:DESCRIPCION,:DIFICULTAD,:TIEMPO,:LOGIN)';

        $VALORES                 = [];
        $VALORES[':NOMBRE']      = $nombre;
        $VALORES[':DESCRIPCION'] = $descripcion;
        $VALORES[':DIFICULTAD']  = $dificultad;
        $VALORES[':TIEMPO']      = $tiempo;
        $VALORES[':LOGIN']       = $login;

        $stmt = $dbCon->prepare($mysql);
        if( $stmt->execute($VALORES) )
        { // Se han insertado los datos del registro
          // Se saca el id del nuevo registro
          $mysql2 = "select MAX(id) as id_ruta from ruta";
          $stmt2 = $dbCon->prepare($mysql2);
          if($stmt2->execute())
          {
            $registro = $stmt2->fetch(PDO::FETCH_ASSOC);
            $ID = $registro['id_ruta'];
          }
          else $ID = -1;
          $stmt2->closeCursor();

          $RESPONSE_CODE    = 201;
          $R['RESULTADO']   = 'OK';
          $R['CODIGO']      = $RESPONSE_CODE;
          $R['DESCRIPCION'] = 'Registro creado correctamente';
          $R['ID']          = $ID;
        }
        else
        {
          $RESPONSE_CODE    = 500;
          $R['RESULTADO']   = 'ERROR';
          $R['CODIGO']      = $RESPONSE_CODE;
          $R['DESCRIPCION'] = 'Error de servidor.';
        }
      }
      else
      { // El $ID es numérico por lo que se va a guardar un comentario o una foto de la ruta

        switch(array_shift($RECURSO))
        {
          case 'favorita':
              // Hay que ver si se marca la ruta como favorita o no
              $accion = array_shift($RECURSO);
              if($accion == 'true')
                $mysql = 'insert into favorita(login,id_ruta) values(:LOGIN,:ID_RUTA)';
              else
                $mysql = 'delete from favorita where login=:LOGIN and id_ruta=:ID_RUTA';

              $VALORES             = [];
              $VALORES[':LOGIN']   = $login;
              $VALORES[':ID_RUTA'] = $ID;

              $stmt = $dbCon->prepare($mysql);
              if( $stmt->execute($VALORES) )
              {
                  // Se ha registrado correctamente el seguimiento.
                  $RESPONSE_CODE    = 200;
                  $R['RESULTADO']   = 'OK';
                  $R['CODIGO']      = $RESPONSE_CODE;
                  $R['DESCRIPCION'] = 'Se ha realizado correctamente la operación.';
                  $R['id_ruta']     = $ID;
                  $R['favorita']    = $accion=='true'?'TRUE':'FALSE';

                  // Hay que sacar el número de favoritos
                  $mysql = 'select count(*) as nFavs from favorita where id_ruta=:ID_RUTA';
                  $stmt2 = $dbCon->prepare($mysql);
                  if( $stmt2->execute([':ID_RUTA' => $ID]) )
                  {
                    $registro = $stmt2->fetch(PDO::FETCH_ASSOC);
                    $R['nfavoritas'] = $registro['nFavs'];
                  }
              }
              else
              {
                if( $stmt->errorCode()==23000 )
                {
                  // Ya existe la entrada en la BD y no se puede duplicar
                  $RESPONSE_CODE    = 409;
                  $R['RESULTADO']   = 'ERROR';
                  $R['CODIGO']      = $RESPONSE_CODE;
                  $R['DESCRIPCION'] = 'No se puede realizar la operación porque esta ruta ya está marcada como favorita para este usuario.';
                  $R['id_ruta']     = $ID;
                }
              }
            break;
          case 'comentario': // Se va a añadir una pregunta
              $texto = nl2br($PARAMS['texto']); // Texto de la respuesta
              $mysql  = 'insert into comentario(texto,login,id_ruta) ';
              $mysql .=  'values(:TEXTO,:LOGIN,:ID_RUTA);';

              $VALORES             = [];
              $VALORES[':ID_RUTA'] = $ID;
              $VALORES[':LOGIN']   = $login;
              $VALORES[':TEXTO']   = $texto;

              $stmt = $dbCon->prepare($mysql);
              if( $stmt->execute($VALORES) )
              {
                // ===============================================================
                // Se ha guardado el comentario correctamente.
                $mysql2 = "select MAX(id) as id_comentario from comentario";
                $stmt2 = $dbCon->prepare($mysql2);
                if($stmt2->execute())
                {
                  $registro = $stmt2->fetch(PDO::FETCH_ASSOC);
                  $ID_COMENTARIO = $registro['id_comentario'];
                }
                else $ID_COMENTARIO = -1;
                $stmt2->closeCursor();

                $RESPONSE_CODE      = 201;
                $R['RESULTADO']     = 'OK';
                $R['CODIGO']        = $RESPONSE_CODE;
                $R['DESCRIPCION']   = 'Comentario guardado correctamente.';
                $R['id_comentario'] = $ID_COMENTARIO;
                // ===============================================================
              }
              else
              {
                $RESPONSE_CODE    = 500;
                $R['RESULTADO']   = 'ERROR';
                $R['CODIGO']      = $RESPONSE_CODE;
                $R['DESCRIPCION'] = 'Se ha producido un error al intentar guardar la respuesta.';
              }
            break;
          case 'foto': // Se sube una foto

              if(isset($_FILES['fichero']))
              {
                // Se comprueba si el autor de la ruta es quien está subiendo la foto
                $mysql = 'select login from ruta where id=:ID_RUTA';
                $stmt = $dbCon->prepare($mysql);
                if( $stmt->execute([':ID_RUTA' => $ID]) )
                {
                  $registro = $stmt->fetch(PDO::FETCH_ASSOC);
                  if($registro['login'] == $login)
                  {
                    if($_FILES['fichero']['size'] > $max_uploaded_file_size)
                    {
                      $RESPONSE_CODE    = 400;
                      $R['RESULTADO']   = 'ERROR';
                      $R['CODIGO']      = $RESPONSE_CODE;
                      $R['DESCRIPCION'] = 'Tamaño del archivo demasiado grande. El máximo es ' . $max_uploaded_file_size / 1024 . ' KB';
                    }
                    else
                    {
                      $texto = nl2br($PARAMS['texto']); // Texto de la respuesta
                      $R     = subirFoto($ID, $texto, $_FILES['fichero']);
                    }
                  }
                  else
                  {
                    $RESPONSE_CODE    = 403;
                    $R['RESULTADO']   = 'ERROR';
                    $R['CODIGO']      = $RESPONSE_CODE;
                    $R['DESCRIPCION'] = 'El usuario que sube la foto no es el autor de la ruta.';
                  }
                }
                else
                {
                  $RESPONSE_CODE    = 500;
                  $R['RESULTADO']   = 'ERROR';
                  $R['CODIGO']      = $RESPONSE_CODE;
                  $R['DESCRIPCION'] = 'Se ha producido un error al intentar guardar la foto.';
                }
                $stmt->closeCursor();
              }
              else
              {
                $RESPONSE_CODE    = 500;
                $R['RESULTADO']   = 'ERROR';
                $R['CODIGO']      = $RESPONSE_CODE;
                $R['DESCRIPCION'] = 'Se ha producido un error al intentar guardar la foto.';
              }
            break;
        }
      }
      $dbCon->commit();
    }catch(Exception $e){
      $dbCon->rollBack();
    }
  } // if( !comprobarSesion($login,$clave) )
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