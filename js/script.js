var KEY_ENTER = 13;
var today;
var defaultErrorMsg='Попробуйте обновить страницу или повторите попытку позже';
var bodyBackup


function getExpDate(days, hours, minutes, seconds) {
    var expDate = new Date();
    if (days) expDate.setDate(expDate.getDate() + parseInt(days));
    if (hours) expDate.setHours(expDate.getHours() + parseInt(hours));
    if (minutes) expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));
    if (seconds) expDate.setSeconds(expDate.getSeconds() + parseInt(seconds));
    return expDate.toUTCString();
}

function getCookie(name) {
    var masCookie = document.cookie.split("; ");
    for (var i = 0; i < masCookie.length; i++){
        var oneCookie = masCookie[i].split("=");
        if (name == oneCookie[0]) return unescape(oneCookie[1]);
    }
}

function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        (expires ? ";expires=" + expires : "") +
        (path ? ";path=" + path : "") +
        (domain ? ";domain=" + domain : "") +
        (secure ? ";secure" : "");
}

const DEFAULT_PLACEHOLDER = '[Нажмите для ввода]';

function initJinplace(selector) {
    $(selector).jinplace({
        url: false,
        textOnly: true,
        nil: DEFAULT_PLACEHOLDER,
        onSubmit: function() {
            for (var i in Zakupka.informer) {
            
                var $obj = $('#'+Zakupka.informer[i].id);
                var val = $obj.text();
                if (val === $obj.attr('data-nil') || val === DEFAULT_PLACEHOLDER)
                    val = ''
                Zakupka.informer[i].val = val

                if (navigator.cookieEnabled)
                    setCookie(Zakupka.informer[i].id, Zakupka.informer[i].val, getExpDate(365));
            }
        }
    });
}

var Zakupka = {
	url: '',
    options: {
        urls: {
            xml: '/getxml.php', // передавать id
            html:'/gethtml.php',// передавать url
            date:'/getdate.php' // получение текущего времени в формате m/dd/yyyy hh:mm (UTC+hhhh)
        }
    },
    // Номер заказа
    id: 0,
    // Заказчик
	 // Данные, получаемые из извещения xml
    customer: {
        name: {
            id: 'customerName',
            val: 'Название заказчика',
           selector: 'organization > fullName:eq(0)'//'contactInfo > orgName:eq(0)' //TODO: проверить, правильный ли селектор
        },
        shortName: {
            id: '',
            val: 'Краткое азвание заказчика',
           selector: 'contactInfo  > orgShortName:eq(0)'//'contactInfo > orgName:eq(0)' //TODO: проверить, правильный ли селектор
        },
        address: {
            id: 'customerAddress',
            val: 'Адрес заказчика',
            selector: 'contactInfo > orgFactAddress:eq(0)'
        },
        contactPerson: {
            id: 'customerContactPerson',
            val: 'Контактное лицо заказчика',
            selector: 'contactInfo > contactPerson:eq(0)'
        },
        phone: {
            id: 'customerPhone',
            val: 'Телефон заказчика',
            selector: 'contactInfo > contactPhone:eq(0)'
        },
        fax: {
            id: 'customerFax',
            val: 'Факс заказчика',
            selector: 'contactInfo > contactFax:eq(0)'
        },
        email: {
            id: 'customerEmail',
            val: 'Email заказчика',
            selector: 'contactInfo > contactEMail:eq(0)'
        },
		 orderPlacedBy: {
			id:'',
			val:'Размещение заказа осуществляется',  //Z - заказчиком, U - уполномоченным органом, S - специализированной организацией
			selector:'order placerOrgType:eq(0)'
		},
		orderWay: {
			val:'Размещение заказа осуществляется', 
			selector:'placingWay > name:eq(0)'
		}
    },
	accredited:{
		name: {
			val:'Способ размещения заказа', 
			selector:'order placerOrganization>fullName:eq(0)',
		},
		adress: {
			val:'Наименование', 
			selector:'order placerOrganization>factualAddress>addressLine:eq(0)',
		},
		email: {
			val:'Адрес электронной почты', 
			selector:'order placerOrganization>email:eq(0)',
		},
		phone: {
			val:'Телефон', 
			selector:'order placerOrganization>phone:eq(0)',
		},
		fax: {
			val:'Факс', 
			selector:'order placerOrganization>fax:eq(0)',
		},
		contactPerson: {
			val:'Контактное лицо', 
			selector:'order placerOrganization>contactPerson:eq(0)',
		}
	},
	special:{
		name: {
			val:'Наименование', 
			selector:'order placerOrganization>fullName:eq(0)',
		},
		adress: {
			val:'Наименование', 
			selector:'order placerOrganization>factualAddress>addressLine:eq(0)',
		},
		email: {
			val:'Адрес электронной почты', 
			selector:'order placerOrganization>email:eq(0)',
		},
		phone: {
			val:'Телефон', 
			selector:'order placerOrganization>phone:eq(0)',
		},
		fax: {
			val:'Факс', 
			selector:'order placerOrganization>fax:eq(0)',
		},
		contactPerson: {
			val:'Контактное лицо', 
			selector:'order placerOrganization>contactPerson:eq(0)',
		}
	},
    // Заявитель
    informer: {
        name: {id: 'informerName', val: ''},
        address: {id: 'informerAddress', val: ''},
        place: {id: 'informerPlace', val: ''},
        phone: {id: 'informerPhone', val: ''},
        fax: {id: 'informerFax', val: ''},
        email: {id: 'informerEmail', val: ''},
        mobile: {id: 'informerMobile', val: ''}
    },
	
	// Информация о заказе, получаемая со страницы заказа
	zakaz:{
		orderName: {
			val: ''
		},
		timePlaced: {
			date: null, // дата размещения заявки на сайте
			localTime: null, // часовой пояс местного времени заказчика
			expired: false // истекла ли дата
		},
		timeBegin: {
			date: null, // дата начала подачи котировочных заявок
		},
		timeExp: {
			date: null, // дата окончания подачи котировочных заявок
			expired: false // истекла ли дата
		},
		orderType: {
			val: 'Тип заказа',
			selector: 'placingWay > type'
	/*
			OK = Извещение о проведении открытого конкурса
			SZ = Сообщение о заинтересованности в проведении открытого конкурса
			EF = Извещение о проведении открытого аукциона в электронной форме
			OA = Извещение о проведении открытого аукциона
			ZK = modificationStatus='P' Извещение о продлении срока подачи котировочных заявок
										Извещение о проведении запроса котировок
			PO = Извещение о проведении предварительного отбора
	*/},
		// Размещение заказа осуществляет Заказчик/Уполномоченный орган/Специализированная организация
		orderPlacedBy: {
			val:'', // значение 
			isAccredited:false, // Уполномоченный орган 
			//accredited.name: '',
			accredited: {
				name: '',
				adress: '',
				email: '',
				phone: '',
				fax: '',
				contactPerson: ''
			},
			isSpecial:false, // Специализированная организация
			special: {
				name: '',
				adress: '',
				email: '',
				phone: '',
				fax: '',
				contactPerson: ''
			},
			customer:{ //Заказчик
				name: '',
				address: '',
				email: '',
				phone: '',
				fax: '',
				contactPerson: ''
			}
		},
	// Цена заказа
		orderPrice: {
			val:'', // значение 
			currency:'' // валюта
		},
		orderNum: { // Номер заказа
			val:'' // значение 
		},
		// Способ размещения
		orderWay: {
			val:'',
			rod: '',
			pred: ''	
		}
    },
    init: function(){
        for (var i in Zakupka.informer) {
            // Чтение из куки сохраненных данных
            Zakupka.informer[i].val = getCookie(Zakupka.informer[i].id) || '';
            // Вывод полученных данных в форму
            if ($('#'+Zakupka.informer[i].id).hasClass('inputText')) {
                var jp = $('#'+Zakupka.informer[i].id).data('plugin_jinplace');
                jp.onUpdate(Zakupka.informer[i].val);
            } else {
                $('#'+Zakupka.informer[i].id).text( Zakupka.informer[i].val );
            }
        }
    },
    // Получение данных с сервера
    getData: function(url){
		Zakupka.url=url;
        Zakupka.id = url.substring( url.indexOf('=') + 1 );

        // Обращение ко вкладке «Общая информация» вида
        // http://zakupki.gov.ru/pgz/public/action/orders/info/common_info/show?notificationId=4054460
        $.ajax({
            url: Zakupka.options.urls.html,
            data: {url: url},
            dataType: 'html',
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus);
				showErrorMessage(defaultErrorMsg); 
            },
            success: function(data, textStatus, jqXHR){
                // Обработка HTML со вкладки «Общая информация» (объект data)
				$.ajax({
					url: Zakupka.options.urls.date,
					dataType: 'json',
					error: function(jqXHR, textStatus, errorThrown){
						console.log(textStatus);
						showErrorMessage(defaultErrorMsg); 
					},
					success: function(dataTime, textStatusTime, jqXHRTime){
							
					
        				today = new Date(dataTime.date); 
        				
        				// Размещение заказа осуществляет
                        var orderPlacedBy = findValueByTitle(data, 'Размещение заказа осуществляет');
                        if (!orderPlacedBy) {
                            console.log("Zakupka.options.urls.html ==> " + Zakupka.options.urls.html);
                            return;
                        }
        				Zakupka.zakaz.orderPlacedBy.val=orderPlacedBy[0];
							// Уполномоченный орган
							if(Zakupka.zakaz.orderPlacedBy.val.indexOf('Уполномоченный орган')!=-1){
								Zakupka.zakaz.orderPlacedBy.isAccredited=true;
								Zakupka.zakaz.orderPlacedBy.accredited.name=$(data).find('.orderInfoCol2').find('.iceCmdLnk:eq(1)').html().trim();
								var accreditedId = $(data).find('.orderInfoCol2').find('.iceCmdLnk:eq(1)').attr('onclick').toString()
								accreditedId = accreditedId.substring(accreditedId.indexOf("=")+1, accreditedId.indexOf("','") );
								var accreditedUrl='http://zakupki.gov.ru/pgz/public/action/organization/view?organizationId='+accreditedId;
								$.ajax({									
									url: Zakupka.options.urls.html,
									data: {url: accreditedUrl},
									dataType: 'html',
									error: function(jqXHR, textStatus, errorThrown){
										console.log(textStatus);
										showErrorMessage(defaultErrorMsg); 
									},
									success: function(data, textStatus, jqXHR){
										Zakupka.zakaz.orderPlacedBy.accredited.adress=findValueByTitle('Место нахождения');
										Zakupka.zakaz.orderPlacedBy.accredited.email=findValueByTitle('Контактный адрес электронной почты');
										Zakupka.zakaz.orderPlacedBy.accredited.phone=findValueByTitle('Телефон');
										Zakupka.zakaz.orderPlacedBy.accredited.fax=findValueByTitle('Факс');
										Zakupka.zakaz.orderPlacedBy.accredited.contactPerson=findValueByTitle('Контактное лицо');
										
										function findValueByTitle(label){ // Переопределенная функция для поиска данных на странице предприятия
											return $(data).find('.iceOutLbl').filter(function(){ return jQuery(this).text().trim()==label}).next('td').text().trim();
										}
									}
								}); 
							}else{
							//Специализированная организация
							if(Zakupka.zakaz.orderPlacedBy.val.indexOf('Специализированная организация')!=-1){
								Zakupka.zakaz.orderPlacedBy.isSpecial=true;
								Zakupka.zakaz.orderPlacedBy.special.name=$(data).find('.orderInfoCol2').find('.iceCmdLnk:eq(1)').html().trim();
								var specialId = $(data).find('.orderInfoCol2').find('.iceCmdLnk:eq(1)').attr('onclick').toString()
								specialId = specialId.substring(specialId.indexOf("=")+1, specialId.indexOf("','") );
								var specialUrl='http://zakupki.gov.ru/pgz/public/action/organization/view?organizationId='+specialId;
								console.log(specialUrl);
								$.ajax({					// Получение данных о предприятии 				
									url: Zakupka.options.urls.html,
									data: {url: specialUrl},
									dataType: 'html',
									error: function(jqXHR, textStatus, errorThrown){
										console.log(textStatus);
										showErrorMessage(defaultErrorMsg); 
									},
									success: function(data, textStatus, jqXHR){
										console.log('data '+data);
										Zakupka.zakaz.orderPlacedBy.special.adress=findValueByTitle('Место нахождения');
										Zakupka.zakaz.orderPlacedBy.special.email=findValueByTitle('Контактный адрес электронной почты');
										Zakupka.zakaz.orderPlacedBy.special.phone=findValueByTitle('Телефон');
										Zakupka.zakaz.orderPlacedBy.special.fax=findValueByTitle('Факс');
										Zakupka.zakaz.orderPlacedBy.special.contactPerson=findValueByTitle('Контактное лицо');
										
										function findValueByTitle(label){ // Переопределенная функция для поиска данных на странице предприятия
											return $(data).find('.iceOutLbl').filter(function(){ return jQuery(this).text().trim()==label}).next('td').text().trim();
										}
										//
										$.ajax({		// Получение данных с 							
											url: Zakupka.options.urls.html,
											data: {url: 'http://zakupki.gov.ru/pgz/printForm?type=NOTIFICATION&id=' + Zakupka.id},
											dataType: 'html',
											error: function(jqXHR, textStatus, errorThrown){
												console.log(textStatus);
												showErrorMessage(defaultErrorMsg); 
											},
											success: function(data, textStatus, jqXHR){
												function findValueByTitle(label){ // Переопределенная функция для поиска данных на странице предприятия
													return $(data).find('.iceOutLbl').filter(function(){ return jQuery(this).text().trim()==label}).next('td').text().trim();
												}
											}
										}); 
									}
								}); 
							} 
								else{
							
									Zakupka.zakaz.orderPlacedBy.customer.name=findValueByTitle(data, 'Организация')[0];
									Zakupka.zakaz.orderPlacedBy.customer.address=findValueByTitle(data, 'Адрес места нахождения')[0];
									Zakupka.zakaz.orderPlacedBy.customer.email=findValueByTitle(data, 'Контактное лицо')[7]
									Zakupka.zakaz.orderPlacedBy.customer.phone=findValueByTitle(data, 'Контактное лицо')[2];
									Zakupka.zakaz.orderPlacedBy.customer.fax=findValueByTitle(data, 'Контактное лицо')[4]
									Zakupka.zakaz.orderPlacedBy.customer.contactPerson=findValueByTitle(data, 'Контактное лицо')[0];
								}
							
							}	
        				//Получение способа размещения заказа
        				Zakupka.zakaz.orderWay.val=findValueByTitle(data, 'Способ размещения заказа')[0];
						
						switch(Zakupka.zakaz.orderWay.val)
						{
							case 'Открытый аукцион в электронной форме':
								Zakupka.zakaz.orderWay.rod='открытого аукциона в электронной форме';
								Zakupka.zakaz.orderWay.pred='и время окончания срока подачи заявок на участие в открытом аукционе в электронной форме';
								// Получение названия закупки		
								Zakupka.zakaz.orderName.val=findValueByTitle(data, 'Краткое наименование аукциона')[0]; 
								
								/* // Получение даты начала котировочных заявок	
								dateStr=findValueByTitle(data, 'Начало подачи котировочных заявок')[1];
								Zakupka.zakaz.timeBegin.date=timeFromStr(dateStr); */
								
								// Получение даты окончания котировочных заявок				
								dateStr=findValueByTitle(data, 'Дата и время окончания срока подачи заявок на участие в открытом аукционе в электронной форме')[0];
								Zakupka.zakaz.timeExp.date=timeFromStr(dateStr);
							break;
							
							case 'Открытый конкурс':
								Zakupka.zakaz.orderWay.rod='открытого конкурса';
								Zakupka.zakaz.orderWay.pred='вскрытия конвертов с заявками';
								
								//Срок предоставления
								Zakupka.zakaz.orderName.val=findValueByTitle(data, 'Наименование заказа')[0]; 
								
								/* // Получение даты начала котировочных заявок	
								dateStr=findValueByTitle(data, 'Начало подачи котировочных заявок')[1];
								Zakupka.zakaz.timeBegin.date=timeFromStr(dateStr); */
								
								// Получение даты окончания котировочных заявок				
								dateStr=findValueByTitle(data, 'Вскрытие конвертов с заявками')[1];
								Zakupka.zakaz.timeExp.date=timeFromStr(dateStr);
							break;
							
							case 'Запрос котировок':
								Zakupka.zakaz.orderWay.rod='запроса котировок';
								Zakupka.zakaz.orderWay.pred='окончания подачи котировочных заявок';
								// Получение названия закупки		
								Zakupka.zakaz.orderName.val=findValueByTitle(data, 'Наименование заказа')[0];
								
								// Получение даты окончания котировочных заявок				
								dateStr=findValueByTitle(data, 'Окончание подачи котировочных заявок')[1];
								Zakupka.zakaz.timeExp.date=timeFromStr(dateStr);
							break;			
						}
						
						// Истек ли срок заказа  			       				
        				if(Zakupka.zakaz.timeExp.date < today) { 
        					Zakupka.zakaz.timeExp.expired=true;
        				}
        				
        				//Получение даты размещения заявки на сайте
        				dateStr=$(data).find('.icePnlGrd').find('.iceOutTxt').filter( function(){				
        					return $(this).html().trim()=='Опубликовано';
        				}).next('.iceOutTxt').html().trim();
        				Zakupka.zakaz.timePlaced.date=timeFromStr(dateStr);
        				Zakupka.zakaz.timePlaced.localTime=parseInt(dateStr.substring(dateStr.indexOf('UTC+'), dateStr.indexOf(')'))); 
        				
        				
        				// Получение цены заказа
        				Zakupka.zakaz.orderPrice.val=parseFloat(findValueByTitle(data, 'Начальная (Максимальная) цена контракта')[0].replace(/\s/g,""));
        				Zakupka.zakaz.orderPrice.currency=findValueByTitle(data, 'Начальная (Максимальная) цена контракта')[1];
        				
        				Zakupka.zakaz.orderNum.val=$(data).find('.icePnlGrd').find('.iceOutTxt').filter( function(){				
        					return $(this).html().indexOf('Заказ №')!=-1;
        				}).html().trim();
        				Zakupka.zakaz.orderNum.val=Zakupka.zakaz.orderNum.val.substring(Zakupka.zakaz.orderNum.val.indexOf('№')+1)			;				
        				
					
								// Обращение к документу «Извещение» вида
									// http://zakupki.gov.ru/pgz/printForm?type=NOTIFICATION&id=4054460
									$.ajax({
										url: Zakupka.options.urls.xml,
										data: {id: Zakupka.id},
										dataType: 'xml',
										error: function(jqXHR, textStatus, errorThrown){
											console.log(textStatus);											
											showErrorMessage(defaultErrorMsg); 
										},
										success: function(data, textStatus, jqXHR){
											myData=data;
											for (var i in Zakupka.customer) {
												Zakupka.customer[i].val = $(data).find( Zakupka.customer[i].selector ).text(); // цикл получения данных из XML
											}

											if(Zakupka.zakaz.orderPlacedBy.customer.name==Zakupka.customer.shortName.val.trim().replace(/\s+/g," ")){ // Если имя заказчика в документе совпадает с кратким именем
												Zakupka.zakaz.orderPlacedBy.customer.name=Zakupka.customer.name.val.trim().replace(/\s+/g," ")	
												console.log('short name:'+Zakupka.zakaz.orderPlacedBy.customer.name)	;										
											}

											Zakupka.customer=matchOrgData(Zakupka.customer, Zakupka.zakaz.orderPlacedBy.customer, data);
										
											if(val=Zakupka.zakaz.orderPlacedBy.isAccredited){
												Zakupka.accredited=matchOrgData(Zakupka.accredited, Zakupka.zakaz.orderPlacedBy.accredited, data);
											}
											
											if(val=Zakupka.zakaz.orderPlacedBy.isSpecial){
												Zakupka.special=matchOrgData(Zakupka.special, Zakupka.zakaz.orderPlacedBy.special, data);
											} 
											
											if( Zakupka.zakaz.orderWay.val != Zakupka.customer.orderWay.val ){
												Zakupka.zakaz.orderWay.rod+=' (в документации указано «' + Zakupka.customer.orderWay.val+'») '
												Zakupka.zakaz.orderWay.val+=' (в документации указано «' + Zakupka.customer.orderWay.val+'») '
											}
											Zakupka.zakaz.orderType.val = $(data).find( Zakupka.zakaz.orderType.selector ).text();
											Zakupka.print();
											
										}
									});	
					}
				});
            }
        });
       
    },
    // Вывод данных
    print: function(){
        for (var i in Zakupka.customer) {
            $('#'+Zakupka.customer[i].id).text( Zakupka.customer[i].val );
        }
		// Основная часть
		// Заголовок
		$('#zakaz-type').text(Zakupka.zakaz.orderWay.val +' №'+Zakupka.zakaz.orderNum.val );
		
		if(Zakupka.zakaz.timeExp.expired){
			$('#main-header').text('Обращение');
			// $('.hidden').removeClass('hidden');
		}
		else{
			$('#main-header').text('Жалоба');
			$('.hidden').removeClass('hidden');
		}
		// Дата размещения закупки
		$('#zakaz-time-placed').text(timeToStr(Zakupka.zakaz.timePlaced.date).date);
		
		//Кем размещена
		var placedBy
		if(Zakupka.zakaz.orderPlacedBy.isAccredited){
			placedBy='Уполномоченным органом';
			$('#accredited-name').html(Zakupka.accredited.name.val);
			$('#accredited-email').html(Zakupka.accredited.email.val);
			$('#accredited-phone').html(Zakupka.accredited.phone.val);
			$('#accredited-fax').html(Zakupka.accredited.fax.val);
			$('#accredited-contact-person').html(Zakupka.accredited.contactPerson.val);
			
			$('#accredited').show();
		}
		else{
			if(Zakupka.zakaz.orderPlacedBy.isSpecial){
				placedBy='Специализированной организацией';				
				$('#special-name').html(Zakupka.special.name.val);
				$('#special-address').html(Zakupka.special.adress.val);
				$('#special-email').html(Zakupka.special.email.val);
				$('#special-phone').html(Zakupka.special.phone.val);
				$('#special-fax').html(Zakupka.special.fax.val);
				$('#special-contact-person').html(Zakupka.special.contactPerson.val);
				$('#special').show();
			}
			else{
				placedBy='Заказчиком';
			}
		}
		$('#zakaz-placed-by').text(placedBy);
		
		// Название заказчика
		$('#customer-name').text('«'+Zakupka.customer.name.val+'»');
		
		// Номер заказа
		$('.zakaz-num').text(Zakupka.zakaz.orderNum.val);
		
		// Способ размещения
		$('#zakaz-order-way').text(Zakupka.zakaz.orderWay.rod);
		$('#zakaz-order-way-dateof').text(Zakupka.zakaz.orderWay.pred);
		
		//Название заказа
		$('#zakaz-order-name').text(Zakupka.zakaz.orderName.val);
		
		//URL заказа
		$('#zakaz-link').text(Zakupka.url);
		
		//Цена заказа
		$('#zakaz-price').text(Zakupka.zakaz.orderPrice.val);
		
		//Дата окончания подачи заявок
		var expDate=timeToStr(Zakupka.zakaz.timeExp.date);
		$('#zakaz-exp-date').text(expDate.date);
		$('#zakaz-exp-time').text(expDate.time);
		
		// URL документов заказа
		$('#documents-url').text('http://zakupki.gov.ru/pgz/public/action/orders/info/order_document_list_info/show?notificationId='+Zakupka.id);
		
		// Сегодняшняя дата
		$('#today').text(timeToStr(today).date)
		
        $('#getUrl, #loader').hide();
        $('#wrapper').show();
        // Фокус на первом поле ввода
        $('.inputText:eq(0)').children('input').focus();
    }
}

// Нажатие на кнопку «Сформировать жалобу» или Enter в поле ввода ссылки на заказ
function goNext(){
    $('#loader').show();
    Zakupka.getData( $('#url').val() );
}

function matchOrgData(notifData, pageData, data) {
	for (var i in notifData) {
		//notifData[i].val = $(data).find( notifData[i].selector ).text();
		console.log(notifData[i].selector + ' ' + notifData[i].val)	
		if(notifData[i].val && notifData[i].val.trim().replace(/\s+/g," ") != pageData[i]){
			if(pageData[i]!=undefined){				
				console.log(i+ ': '+'В извещении: '+notifData[i].val+' На странице: '+pageData[i]);
				notifData[i].val=pageData[i]+' (в документации указано: ' + notifData[i].val+') ';
			}
			else console.log('No field on page:'+i)
		}
	}
	return notifData;
} 
function timeFromStr(dateStr){ // преобразует строку вида dd.mm.yyyy * hh:mm * (UTC+hh) в объект Date
				// Формат даты: "28.08.2012 в 14:00"
				var date= new Date(); // получаемая дата
				var timePos; // Позиция начала подстроки времени в строке — позиция двоеточия минус 2 символа
				date.setFullYear(parseInt(dateStr.substr(6, 4)), parseInt(dateStr.substr(4,2))-1, parseInt(dateStr.substr(0,2)));
				timePos=dateStr.indexOf(':')-2;
				date.setHours(parseInt(dateStr.substr(timePos, 2)));
				date.setMinutes(parseInt(dateStr.substr(timePos+3, 2))); 
				date.setSeconds(0); 
				return date;
}
function timeToStr(date){ // преобразует объект Date в массив строк: dateOutput= {date:'dd.mm.yyyy' , time: 'hh:mm'}
				var dateOutput={
					date: '',
					time: ''
				}
				var month=date.getMonth()+1;
				var minutes=date.getMinutes();
				if(month<10) month='0'+month;
				if(minutes<10) minutes='0'+minutes;
				dateOutput.date = date.getDate()+'.'+month+'.'+date.getFullYear();
				dateOutput.time = date.getHours()+':'+minutes;
				return dateOutput;
}

function findValueByTitle(data,labelName){ // находит значение поля информации о заказе по его названию
				var value=[];
                console.log("DATA: " + data);
				var label=$(data).find('.orderInfo').find('.orderInfoCol1').filter( function(){			
					if($(this).find('.iceOutLbl').html()){
						return $(this).find('.iceOutLbl').html().trim()==labelName//'Окончание подачи котировочных заявок';
					}
					else{
						console.log('fail')
					}
				})
				if(label.length){
					label.next('td').find('.iceOutTxt, .iceOutLnk').each(function(i){
						value[i]=$(this).text().trim();
					});
					return value;
				} else{
					showErrorMessage('Возможно, страница недоступна или не существует.');					
				}
				
}

function showErrorMessage(msg) {	// Вывод сообщения об ошибке
				$('#loader').addClass('error').text('Ошибка! ' + msg);
}
$(function(){
    $('#url').focus().on('keypress', function(e){
        if (e.keyCode == KEY_ENTER) goNext();
    });
    $('#btnGo').on('click', goNext);
    $('#btnPrint').on('click', function(e){
    
        $('.inputText').each(function(){
            var $this = $(this);
            var jp = $this.data('plugin_jinplace');
            jp.fetchData(jp.opts).done( function(data) {
                $this.hide();
                $('<span class="temporary">' + data + '</span>').insertAfter($this);
            });
        });

		$('#violations').find('input, textarea').each(function(){
			var el=$(this)
			var text=$(this).attr('value');
			if ( $(this)[0].tagName == 'TEXTAREA' ){
				el.after('<span class="textArea">'+ text +'</span>').remove()
			} else{
				el.after(text).remove();
			}
		});
		$('.violation-checkbox').each(function(){
			var el=$(this);
			if(el.attr('checked')){
				el.hide();
			} else{
				el.closest('.violation-choice').hide();
			}
		});  

		$('.addViolation, .removeViolation').hide();
        $('.add-violation-form').hide();
        $(this).hide();
        $('#btnBack').show();
        $('#btnPrintPDF').show();
    });
	
	$('#btnBack').on('click', function(e){
        $('.inputText').show();
        $('.temporary').remove();
        
		$('#btnBack').hide();
        $('#btnPrintPDF').hide();
        $('#btnPrint').show();
        $('.addViolation, .removeViolation').show();
        $('.add-violation-form').show();
    });
	
    $('#btnPrintPDF').on('click', function(e){
        window.print();
    });
    
    initJinplace('.inputText');
	
	$('.addViolation').on('click', function(e){
		e.preventDefault();
		var index= $('#violations').children('li:visible').index()+1;
		$('#violations').children('li:eq('+index+')').slideDown();
	});
	$('.removeViolation').on('click', function(e){
		e.preventDefault();
		$(this).closest('li').slideUp();
	});
	
    Zakupka.init();
});


