<?php
if(isset($_POST['name']) && !empty($_POST['name']) && isset($_POST['ext']) && !empty($_POST['ext']) && isset($_POST['json']) && !empty($_POST['json'])) {

    $backupFile = "backup/";
    $handle = @fopen($backupFile.$_POST['name'].".".$_POST['ext'], "w");
    if ($handle) {
        fwrite($handle, $_POST['json']);
        fclose($handle);
        echo "OK";
    }else{
        echo "NOK";
    }
}else{
    echo "NOK";
}