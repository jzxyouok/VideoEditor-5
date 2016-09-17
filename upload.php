<?php

// fixe le niveau de rapport d'erreur
if (version_compare(phpversion(), '5.3.0', '>=') == 1)
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
else
    error_reporting(E_ALL & ~E_NOTICE);

function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round($bytes / pow(1024, ($i = floor(log($bytes, 1024)))), $precision).' '.$unit[$i];
}

if (isset($_FILES['myfile'])) {
    $target_dir = "upload/";
    $target_file = $target_dir . basename($_FILES['myfile']["name"]);
    $uploadOk = true;
    $fileType = pathinfo($target_file, PATHINFO_EXTENSION);
    
    if (file_exists($target_file)) {
        $uploadOk = false;
    }
    
    $sFileName = $_FILES['myfile']['name'];
    $sFileType = $_FILES['myfile']['type'];
    $sFileSize = bytesToSize1024($_FILES['myfile']['size'], 1);
    if (!$uploadOk) {
        echo "<div class=\"s\">Sorry, there was an error uploading your file " . $sFileName . "</div>";
    } else {
        if(move_uploaded_file($_FILES['myfile']['tmp_name'], $target_file)){
            echo "
		<div class=\"s\">
		<p>Le fichier : ".$sFileName." a été correctement transféré.</p>
		<p>Type : ".$sFileType."</p>
		<p>Taille : ".$sFileSize."</p>
		</div>";
        }else{
            echo "<div class=\"f\">Une erreur de type 2 s'est produite avec ". $sFileName."</div>";
        }
    }
    
} else {
    echo '<div class="f">Une erreur s\'est produite</div>';
}