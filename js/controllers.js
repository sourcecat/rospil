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
        }
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