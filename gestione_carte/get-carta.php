<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gestione_carte";

// Creazione connessione
$conn = new mysqli($servername, $username, $password, $dbname);

// Controllo connessione
if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

$codice = $_GET['codice'];
$password = $_GET['password'];

// Ottenere i dati della carta dal database
$sql = "SELECT proprietario, saldo, bloccata FROM carte_credito WHERE codice='$codice' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode([]);
}

$conn->close();
?>
