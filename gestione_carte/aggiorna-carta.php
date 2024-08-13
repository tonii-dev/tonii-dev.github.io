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

$codice = $_POST['codice'];
$password = $_POST['password'];
$bloccata = isset($_POST['bloccata']) ? 1 : 0;

// Aggiornamento della carta nel database
$sql = "UPDATE carte_credito SET bloccata='$bloccata' WHERE codice='$codice' AND password='$password'";

if ($conn->query($sql) === TRUE) {
    echo "Carta aggiornata con successo";
} else {
    echo "Errore nell'aggiornamento della carta: " . $conn->error;
}

$conn->close();
?>
