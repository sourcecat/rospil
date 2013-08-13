function ViolationsController($scope) {
    const TEMPLATES_DIR = '/templates/';
    
    $scope.violations = {
        '1': {
            short_name: 'Не указана НМЦК',
            violation_html: 'ne_ukazana_nmzk.html'
        },
        '2': {
            short_name: 'Запрет привлечения субподрядчиков',
            violation_html: 'zapret_privlechenia_subpodryadchikov.html'
        },
        '3': {
            short_name: 'Отсутствие источников обоснования НМЦК',
            violation_html: 'otsutstvie_istochnikov_obosnovaniya_nmzk.html'
        },
        '4': {
            short_name: 'Отсутствует проектная документация',
            violation_html: 'otsutstvuet_proektnaya_dokumentaziya.html'
        },
        '5': {
            short_name: 'Неверное наименование заказа',
            violation_html: 'nevernoe_naimenovanie_zakaza.html'
        },
        '6': {
            short_name: 'Не установлены требования к результатам работ',
            violation_html: 'ne_ustanovleny_trebovaniya_k_rezultatam_rabot.html'
        },
        '7': {
            short_name: 'Ограничения на ознакомление с документацией',
            violation_html: 'ogranicheniya_na_oznakomlenie_s_dokumentaziey.html'
        },
        '8': {
            short_name: 'Не указан адрес выполнения работ',
            violation_html: 'ne_ukazan_adres_vypolneniya_rabot.html'
        },
    };
    
    $scope.setViolation = function() {
        if ($scope.selected) {
            $scope.violation_html = TEMPLATES_DIR + $scope.violations[$scope.selected].violation_html;
        } else {
            $scope.violation_html = '';
        }
    }
    
    $scope.renderHtml = function() {
        initJinplace('.inputText');
    }
}