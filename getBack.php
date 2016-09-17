<?php
if(isset($_POST['name']) && !empty($_POST['name']) && isset($_POST['ext']) && !empty($_POST['ext'])) {
    $backupFile = "backup/";
    $handle = @fopen($backupFile.$_POST['name'].".".$_POST['ext'], "r");
    if ($handle) {
        $json = "";
        while (($buffer = fgets($handle, 4194304)) !== false) {
            $json .= $buffer;
        }
        echo $json;
        if (!feof($handle)) {
            echo "NOK";
        }
        fclose($handle);
    }else{
        echo "NOK";
    }
}else{
echo "NOK";
}