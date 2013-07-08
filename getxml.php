<?php
    $commonUrl = 'http://zakupki.gov.ru/pgz/public/action/orders/info/common_info/show?notificationId=';
    $notifyUrl = 'http://zakupki.gov.ru/pgz/printForm?type=NOTIFICATION&id=';
    $id = $_GET['id'];
    $xmlDoc = new DOMDocument();
    $xmlDoc->load($notifyUrl.$id);
    print mb_convert_encoding($xmlDoc->saveXML(), 'UTF-8', 'windows-1251');
?>