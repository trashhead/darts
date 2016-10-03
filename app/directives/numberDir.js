angular.module("app")
.directive("numberDir", function() {
    return {
        templateUrl: 'templates/numberDir.html',
        controller:function($scope, $rootScope){
            var vm = this;
            vm.selected = false;
            $scope.select = function(){
                var start = new Date();
                var event = $rootScope.$broadcast('clicked', parseInt($scope.n));
                console.log("after broadcast: "+(new Date().getTime()-start.getTime()));
                
                $rootScope.oldN = $rootScope.n;
                if(!event.defaultPrevented && $scope.n != 0){
                    $rootScope.n = $scope.n;
                }
            }
            $scope.$on("clicked", function(event, n){
                if(n != 0){
                    if(!event.defaultPrevented){
                        if($scope.n <= n){
                            $scope.selected = true;
                        }else{
                            $scope.selected = false;
                        }
                    }
                }
            })
        },
        scope: {
            n: '@'
        },
        replace:true 
    };
})