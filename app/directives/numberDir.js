angular.module("app")
.directive("numberDir", function() {
    return {
        templateUrl: 'templates/numberDir.html',
        controller:function($scope, $rootScope){
            var vm = this;
            vm.selected = false;
            $scope.select = function(n){
                if(n > $rootScope.oldN){
                    if(n - $rootScope.oldN > 3){
                        alert("Fler än 3");
                    }else{
                        var event = $rootScope.$broadcast('clicked', n);
                        $rootScope.oldN = n;
                    }
                }else if(n == 0){
                    var event = $rootScope.$broadcast('clicked', n);
                }else if(n == -1){
                    $rootScope.$broadcast('undo', n);
                }
            }
        },
        scope: {
            n: '='
        },
        replace:true 
    };
})