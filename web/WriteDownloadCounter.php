<?php
if(!empty($_POST['JSON']) and !empty($_POST['FileName'])){
    $json = $_POST['JSON']
    $fname = $_POST['FileName']

    $file = fopen($fname, 'w')
    fwrite($file, $json)
    fclose($fname)
}
?>