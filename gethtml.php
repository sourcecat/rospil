<?php
    
    $url = $_GET['url'];
    $homepage = file_get_contents($url);
    
    //echo htmlspecialchars($homepage);
    echo $homepage;
?>