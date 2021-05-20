<?php
// ============================================================
// ACCESO A LA BASE DE DATOS
// ============================================================
class Database{
    // Configuración del servidor de base de datos
    private $host     = "127.0.0.1";
    // private $host     = "localhost"; // si no funciona con $host=127.0.0.1, probar con éste.
    private $db_name  = "puzzle";
    private $username = "pcw";
    private $password = "pcw";
    public $conn;

    // get the database connection
    public function getConnection(){

        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
        // And pass optional (but important) PDO attributes
        $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $this->conn;
    }
}
?>