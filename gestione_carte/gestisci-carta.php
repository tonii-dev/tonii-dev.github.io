<?php
$codice = $_POST['codice'];
$password = $_POST['password'];

// Reindirizzamento a gestisci-carta.html con i parametri GET
header("Location: gestisci-carta.html?codice=$codice&password=$password");
exit();
?>
