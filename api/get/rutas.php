 <?php
// FICHERO: api/get/rutas.php
// =================================================================================
// PETICIONES GET ADMITIDAS:
// =================================================================================
//   api/rutas  -------------------> devuelve toda la información de todas las rutas
//   api/rutas/{ID} ---------------> devuelve toda la información de la ruta con el ID que se le pasa
//   api/rutas/{ID}/fotos ---------> devuelve todas las fotos de la ruta con el ID que se le pasa
//   api/rutas/{ID}/comentarios ---> devuelve todos los comentarios de la ruta con el ID que se le pasa.
//                                   Para obtener los comentarios en orden descendente de fecha: api/rutas/{ID}/comentarios/desc

// PARÁMETROS PARA LA BÚSQUEDA. DEVUELVE LOS REGISTROS QUE CUMPLAN TODOS LOS CRITERIOS DE BÚSQUEDA.
// SE PUEDEN COMBINAR TODOS LOS PARÁMETROS QUE SE QUIERA EN LA MISMA URL MEDIANTE EL OPERADOR &.
// EN LA CONSULTA EN LA BD SE UTILIZARÁ EL OPERADOR AND PARA COMBINAR TODOS LOS CRITERIOS ESPECIFICADOS.
//   api/rutas?t={texto} -> busca el texto indicado en el título y la descripción. Devuelve la lista de registros que contengan en el título y/o la descripción, al menos, una de las palabras, separadas por comas ",", indicadas en {texto}. Por ejemplo: api/rutas?t=picos,pirineos
//	 api/rutas?a={login} -> búsqueda por autor de la ruta. Por ejemplo: api/rutas?a=usuario3
//   api/rutas?fav -> Devuelve la lista de rutas favoritas del usuario logueado. Necesita la cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}".
//   api/rutas?td={tiempo desde}&th={tiempo hasta} -> búsqueda por tiempo de ruta, desde-hasta. Se puede utilizar solo uno de los dos parámetros. Para indicar el orden, se puede añadir el parámetro td con el valor 'asc' o 'desc', para orden ascendente o descendente, respectivamente. Por ejemplo: api/rutas?td=2.5&th=6&ot=asc
//   api/rutas?dd={dificultad desde}&dh={dificultad hasta} -> búsqueda por dificultad, desde-hasta. Se puede utilizar solo uno de los dos parámetros. Para indicar el orden, se puede añadir el parámetro od con el valor 'asc' o 'desc', para orden ascendente o descendente, respectivamente. Por ejemplo: api/rutas?dd=3&dh=5&od=desc

// PAGINACIÓN
//	 api/rutas?pag={página}&lpag={número de registros por página} -> devuelve los registros que están en la página que se le pide, tomando como tamaño de página el valor de lpag. Por ejemplo: api/rutas?t=pirineos&pag=0&lpag=2

// Si se proporciona la cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}" para una ruta concreta (se especifica el ID de la ruta),
// devuelve un campo adicional, ruta_favorita, que vale 1 si el usuario tiene la ruta con el ID especificado como favorita. En caso contrario, devuelve 0.

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
// Se pillan los parámetros de la petición
$PARAMS = array_slice($_GET, 1, count($_GET) - 1,true);

// =================================================================================
// =================================================================================
// FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================

// =================================================================================
// Añade las condiciones de filtro (búsqueda)
// =================================================================================
// $mysql   -> Guarda el sql
// $valores -> guardará los valores de los parámetros, ya que la consulta en $mysql es preparada
// $params  -> Trae los parámetros de la petición
function aplicarFiltro($mysql, &$valores, $params)
{
    // BÚSQUEDA POR TEXTO: BÚSQUEDA EN TÍTULO Y DESCRIPCIÓN AL MISMO TIEMPO
    if( isset($params['t']) ) // búsqueda
    {
        if(substr($mysql, -5) != 'where') $mysql .= ' and';
        $mysql .= ' (false';

        $texto = explode(',', $params['t']);
        $paraNombre = '';
        $paraDescripcion = '';
        foreach ($texto as $idx=>$valor) {
            $paraNombre .= ' or r.nombre like :txt' . $idx;
            $valores[':txt' . $idx] = '%' . $valor . '%';
            $paraDescripcion .= ' or r.descripcion like :desc' . $idx;
            $valores[':desc' . $idx] = '%' . $valor . '%';
        }
        $mysql .= $paraNombre . $paraDescripcion . ')';
    }
    // BÚSQUEDA POR AUTOR (LOGIN)
    if( isset($params['a']) )
    {
        if(substr($mysql, -5) != 'where') $mysql .= ' and';
        $mysql .= ' r.login=:LOGIN';
        $valores[':LOGIN'] = $params['a'];
    }
    // BÚSQUEDA POR DIFICULTAD
    // * DESDE
    if( isset($params['dd']) && is_numeric($params['dd']) )
    {
        if(substr($mysql, -5) != 'where') $mysql .= ' and';
        $mysql .= ' r.dificultad>=:DIF_DESDE';
        $valores[':DIF_DESDE'] = $params['dd'];
    }
    // * HASTA
    if( isset($params['dh']) && is_numeric($params['dh']) )
    {
        if(substr($mysql, -5) != 'where') $mysql .= ' and';
        $mysql .= ' r.dificultad<=:DIF_HASTA';
        $valores[':DIF_HASTA'] = $params['dh'];
    }
    // BÚSQUEDA POR DURACIÓN DE LA RUTA
    // * DESDE
    if( isset($params['td']) && is_numeric($params['td']) )
    {
        if(substr($mysql, -5) != 'where') $mysql .= ' and';
        $mysql .= ' r.tiempo>=:TIEMPO_DESDE';
        $valores[':TIEMPO_DESDE'] = $params['td'];
    }
    // * HASTA
    if( isset($params['th']) && is_numeric($params['th']) )
    {
        if(substr($mysql, -5) != 'where') $mysql .= ' and';
        $mysql .= ' r.tiempo<=:TIEMPO_HASTA';
        $valores[':TIEMPO_HASTA'] = $params['th'];
    }

    return $mysql;
}
// =================================================================================
// CONFIGURACIÓN DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// SE PILLAN LAS CABECERAS
// =================================================================================
$headers = apache_request_headers();
// =================================================================================
// CABECERA DE AUTORIZACIÓN
// =================================================================================
if(isset($headers['Authorization']))
    $AUTORIZACION = $headers['Authorization'];
elseif (isset($headers['authorization']))
    $AUTORIZACION = $headers['authorization'];
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R                   = [];  // Almacenará el resultado.
$RESPONSE_CODE       = 200; // código de respuesta por defecto: 200 - OK
$mysql               = '';  // para el SQL
$VALORES             = []; // Son los valores para hacer la consulta
$TOTAL_COINCIDENCIAS = -1;  // Total de coincidencias en la BD
// SE COGE EL ID DE LA RUTA, SI EXISTE
$ID = array_shift($RECURSO); // Se comprueba si se proporciona el id del registro
// =================================================================================
// SQL POR DEFECTO PARA SELECCIONAR TODOS LOS ARTÍCULOS
// =================================================================================
$mysql  = 'select r.*, ';
$mysql .= '(select f.fichero from foto f where f.id_ruta=r.id order by f.id limit 0,1) as imagen,';
$mysql .= '(select f.texto as foto_texto from foto f where f.id_ruta=r.id order by f.id limit 0,1) as texto_imagen,';
$mysql .= '(select u.foto from usuario u where r.login=u.login) as foto_autor,';
$mysql .= '(select count(*) from foto f where f.id_ruta=r.id) as nfotos,';
$mysql .= '(select count(*) from favorita fv where fv.id_ruta=r.id) as nfavoritas,';
$mysql .= '(select count(*) from comentario c where c.id_ruta=r.id) as ncomentarios';

if(isset($AUTORIZACION) && is_numeric($ID))
{ // Hay que añadir si el usuario logueado
    list($login,$token) = explode(':', $AUTORIZACION);
    if( $db->comprobarSesion($login,$token) )
        $mysql .= ',(select count(*) from favorita where login="' . $login . '" and id_ruta=' . $ID . ') as ruta_favorita';
}
// =================================================================================
// SE SIGUE CON EL SQL ...
// =================================================================================
$mysql .= ' FROM ruta r';
// =================================================================================
// PRIMER NIVEL DE DECISIÓN: SE PIDEN DATOS DE UN REGISTRO CONCRETO O DE TODOS?
// =================================================================================
if(is_numeric($ID)) // Se debe devolver toda la información del registro
{
    switch (array_shift($RECURSO))
    {
        case 'comentarios': // SE PIDEN LOS COMENTARIOS DE UNA RUTA CONCRETA
                $mysql  = 'select c.*,u.foto as foto_autor from comentario c, usuario u where id_ruta=:ID_RUTA and c.login=u.login order by fecha_hora ';
                if(array_shift($RECURSO) == 'desc')
                    $mysql .= 'desc';
                else
                    $mysql .= 'asc';
                $VALORES = [];
            break;
        case 'fotos': // SE PIDEN LAS FOTOS DE LA RUTA
                $mysql  = 'select id,fichero,texto from foto where id_ruta=:ID_RUTA';
                $VALORES = [];
            break;
        default: // SE PIDE TODA LA INFORMACIÓN DE UN REGISTRO CONCRETO
                $mysql .= ' where r.id=:ID_RUTA';
            break;
    }
    $VALORES[':ID_RUTA'] = $ID;
}
else if( count($PARAMS) > 0 )
{
    // ---------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------
    // Filtrar sólo favoritas, si están marcadas y si el login fue correcto. Se hace antes
    // de aplicar el filtro en base a los parámetros pasados en la url.
    // ---------------------------------------------------------------------------------
    if(isset($AUTORIZACION))
    {
        list($login,$token) = explode(':', $AUTORIZACION);
        if( $db->comprobarSesion($login,$token) )
        {
            if(isset($PARAMS['fav']))
            {
                $mysql .= ', favorita fv where fv.id_ruta=r.id and fv.login=:LOGIN';
                $VALORES[':LOGIN'] = $login;
            }
            else $mysql .= ' where';
        }
        else $mysql .= ' where';
    }
    else $mysql .= ' where';
    // =================================================================================
    // SE AÑADE EL FILTRO EN FUNCIÓN DE LOS PARÁMETROS
    // =================================================================================
    $mysql = aplicarFiltro($mysql, $VALORES, $PARAMS);
    if(substr($mysql, -5) == 'where')
        $mysql = substr($mysql,0,-5);
    // ---------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------
    // Orden de búsqueda
    // ---------------------------------------------------------------------------------
    // Cuando se especifican los dos órdenes, primero se aplica el orden por dificultad
    // y luego el orden por duración de la ruta (tiempo)
    if(isset($PARAMS['od'])) // ordenado por dificultad
    {
        if($PARAMS['od'] == 'asc' || $PARAMS['od'] == 'desc')
            $mysql .= ' order by r.dificultad ' . $PARAMS['od'];
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
    $stmt->execute($VALORES); // execute query
    $TOTAL_COINCIDENCIAS = $stmt->rowCount();
    $stmt->closeCursor();
    $mysql .= $SQL_PAGINACION;
}

// =================================================================================
// SE HACE LA CONSULTA
// =================================================================================
$stmt = $dbCon->prepare($mysql);

if($stmt->execute($VALORES)) // execute query OK
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