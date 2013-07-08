<?php
    $commonUrl = 'http://zakupki.gov.ru/pgz/public/action/orders/info/common_info/show?notificationId=';
    $notifyUrl = 'http://zakupki.gov.ru/pgz/printForm?type=NOTIFICATION&id=';
    $id = $_GET['id'];
    
     
    $url = $baseUrl.$id;
    $homepage = file_get_contents($url);
    $result = '_jqjsp( { "errmark" : ';
    /*$pos = -1;
    do {
        $pos = strpos($homepage, 'rs_err_mark', $pos+1);
        echo '<p>'.$pos.'</p>';
    } while ($pos != false);*/
    
//echo preg_match("/'rs_err_mark'>.*?([а-я][a-z]|[a-z][а-я]).*?</is", $homepage);
    
    //echo htmlspecialchars($homepage);
    /*if ( strpos($homepage, 'rs_err_mark') != false) {
        $result.='true';
    } else {
        $result.='false';
    }
    echo $result.' } )';*/
?>
<!DOCTYPE HTML>
<html lang="ru-RU" id="test">
<head>
	<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Система формирования жалоб</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="getUrl" class="alignCenter">
        <h2>Вставьте ссылку на заказ:</h2>
        <p><input type="text" name="url" id="url" value="http://zakupki.gov.ru/pgz/public/action/orders/info/common_info/show?notificationId=4054460"></p>
        <p><input type="button" value="Сформировать жалобу" id="btnGo" class="btn"></p>
    </div>
    <div id="loader"></div>

    <form id="wrapper" >
        <div id="addressTo" class="alignRight">
            <h3>В Федеральную антимонопольную службу</h3>
            <address>Адрес: 123995, г. Москва, Садовая-Кудринская, д.11</address>
        </div>
        
    
	<div id="accredited" style="display:none;" class="alignRight">
		<h4>Уполномоченный орган: <span id="accredited-name"></span></h4>
            <p><em>Место нахождения:</em> <span id="accredited-address"></span>;</p>
            <p><em>Адрес электронной почты:</em> <span id="accredited-email"></span></p>
            <p><em>Телефон:</em> <span id="accredited-phone"></span>, факс: <span id="accredited-fax"></span>.</p>
            <p><em>Контактное лицо:</em> <span id="accredited-contact-person"></span>;</p>
	</div> 
	<div id="special" style="display:none;" class="alignRight">
		<h4>Специализированная организация: <span id="special-name"></span></h4>
            <p><em>Место нахождения:</em> <span id="special-address"></span>;</p>
            <p><em>Адрес электронной почты:</em> <span id="special-email"></span></p>
            <p><em>Телефон:</em> <span id="special-phone"></span>, факс: <span id="special-fax"></span>.</p>
            <p><em>Контактное лицо:</em> <span id="special-contact-person"></span>;</p>
	</div> 
	
        <div id="customer" class="alignRight">
            <h3>Заказчик:</h3>
            <h4><span id="customerName"></span></h4>
            <p><em>Место нахождения:</em> <span id="customerAddress"></span>;</p>
            <p><em>Контактное лицо:</em> <span id="customerContactPerson"></span>;</p>
            <p><em>Телефон:</em> <span id="customerPhone"></span>, факс: <span id="customerFax"></span>.</p>
            <p><em>Электронная почта:</em> <span id="customerEmail"></span></p>
        </div>
		
        <div id="informer" class="alignRight">
            <h3>Заявитель:</h3>
			<table>
				<tr>
					<td><em>Почтовый адрес:</em></td>
					<td><span id="informerAddress" class="inputText"><input type="text" placeholder="Для корреспонденции"></span></td>
				</tr>
				<tr>
					<td><em>Место жительства:</em></td>
					<td><span id="informerPlace" class="inputText"><input type="text" placeholder="Адрес проживания"></span></td>
				</tr>
				<tr>
					<td><em>Телефон:</em></td>
					<td><span id="informerPhone" class="inputText"><input type="text" placeholder="Номер телефона"></span></td>
				</tr>
				<tr>
					<td><em>Факс:</em></td>
					<td><span id="informerFax" class="inputText"><input type="text" placeholder="Номер факса"></span></td>
				</tr>
				<tr>
					<td><em>Электронная почта:</em></td>
					<td><span id="informerEmail" class="inputText"><input type="text" placeholder="Адрес email"></span></td>
				</tr>
				<tr>
					<td><em>Мобильный телефон:</em></td>
					<td><span id="informerMobile" class="inputText"><input type="text" placeholder="Номер мобильного"></span></td>
				</tr>
			</table>
        

		<div id="zakaz">
		<h4 id="zakaz-type"></h4>
		<h3 id="main-header"></h3>
		<p>
        <span id="zakaz-time-placed" class="otst">Дата</span> на официальном сайте РФ для размещения информации о размещении заказов http://zakupki.gov.ru <span id="zakaz-placed-by">Уполномоченным органом/Заказчиком/Специализированной организацией (зависит от того кто размещает)</span> <span id="customer-name">Наименование заказчика</span> (далее по тексту – Заказчик) размещен заказ №<span class="zakaz-num"></span>  о проведении <span id="zakaz-order-way"></span> «<span id="zakaz-order-name"></span>».
		</p>
		<ul class="otst">
			<li>Электронный адрес заказа:	<span id="zakaz-link">http://zakupki.gov.ru/pgz/public/action/orders/info/common_info/show?notificationId=4050453</span></li>
			<li>Начальная (максимальная) цена контракта: <span id="zakaz-price">1 880 000,00</span> рублей.</li>
			<li>Дата <span id="zakaz-order-way-dateof">и время окончания срока подачи заявок на участие в открытом аукционе в электронной форме/дата окончания подачи котировочных заявок/ дата вскрытия конвертов с заявками</span> — <span id="zakaz-exp-date"></span> в <span id="zakaz-exp-time"></span>.</li>
		</ul>
		<p>
		При размещении заказа Заказчик допустил нарушения Закона о размещении заказов, что может привести к ограничению количества участников размещения заказа:
		<ol id="violations">
			<li>
				<select>
                    <option value="1">Не указана НМЦК</option>
                    <option value="2">Запрет привлечения субподрядчиков</option>
                    <option value="3">Отсутствие источников обоснования НМЦК</option>
                    <option value="4">Отсутствует проектная документация</option>
                </select>
			</li>
		</ol>
		<a href="#" class="addViolation">Добавить пункт</a>
		</p>
		<p>
		Таким образом, при размещении заказа №<span class="zakaz-num"></span> Заказчиком не были соблюдены положения Закона о размещении заказов, что влечет выдачу предписания об отмене торгов.
		</p>
<h3 class="otst">Другая информация, в соответствии со ст. 58 Закона о размещении заказов:</h3>
<p>Фамилии, имена, отчества членов аукционной комиссии, действия (бездействие) которых обжалуются и другие данные членов аукционной комиссии Заказчика, на официальном сайте или на сайте заказчика не представлены и возможности предоставить эти данные в настоящей жалобе я не имею. В случае необходимости, прошу вас истребовать эти данные самостоятельно. </p>
<p>Документы, на основании которых составлена жалоба, все документы, подтверждающие обоснованность доводов жалобы, общедоступны и бесплатны, размещены в сети Интернет и находятся по электронному адресу заказа на официальном сайте госзакупок:
<span id="documents-url"> (адрес, который открывается при нажатии на документы заказа) </span></p>
<p><span class="hidden">В соответствии с п. 3 ст. 60 Закона о размещении заказов, прошу рассмотреть жалобу по существу в течение пяти дней и уведомить меня о результатах рассмотрения жалобы по почте и по электронной почте.</span>
При обнаружении обстоятельств, свидетельствующих о наличии административного правонарушения, прошу привлечь виновных к административной ответственности.</p>


                      <span id="today"></span>  <span id="today-date"></span> <span id="informerFIO" class="alignRight">ФИО полностью</span> <span>______________________</span>

		</div>

        
        <p class="alignCenter" class="otst">
            <input type="button" value="OK" id="btnPrint" class="btn">
            <input type="button" value="Назад" id="btnBack" class="btn">
            <input type="button" value="Печать" id="btnPrintPDF" class="btn">
        </p>
    </form>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="js/jquery-1.8.0.min.js"%3E%3C/script%3E'))</script>
    <script type="text/javascript">
        /*var id = <?php echo $id; ?>;*/
    </script>
    <script type="text/javascript" src="js/script.js"></script>
</body>
</html>