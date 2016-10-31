var controller = function($scope, $rootScope, $uibModal, myService, $cookies){
    function saveHighscoreModal(){
        myService.saveHighscore($cookies.get("spelarnamn"), $scope.arrows).then(function(data){
            showHighscore(data.data);
        })
    }
    function showHighscore(id){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'templates/highscore.html',
            backdrop: 'static',
            controller: function($scope){
                var highscore;
                myService.getHighscore(id).then(function(data){
                    $scope.highscore = data.data;
                })
                $scope.clickTab = function(range){
                    $scope.highscore = null;
                    myService.getHighscore(id, range).then(function(data){
                        $scope.highscore = data.data;
                    })
                }
                $scope.select = function(evt){
                    console.log(evt);
                }
                $scope.id = id;
                $scope.ok = function(number){
                    modalInstance.dismiss('cancel');
                    if($rootScope.oldN == 20){
                        window.location.reload();
                    }
                }
                $scope.remove = function(){
                    myService.removeHighscore(id).then(function(){
                        modalInstance.dismiss("cancel");
                        window.location.reload();
                    })
                }
            }
        });
    }
    function changeUsername(){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'templates/user.html',
            backdrop: 'static',
            scope:$scope,
            controller: function($scope){
                $scope.spelarnamn = $cookies.get("spelarnamn");;
                $scope.ok = function(number){
                    if($scope.spelarnamn != ""){
                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate()+365*10);
                        $cookies.put("spelarnamn", $scope.spelarnamn,{expires:expireDate});
                        $scope.$parent.username = $scope.spelarnamn;
                        modalInstance.dismiss('cancel');
                    }
                }
            }
        });
    }
    var noSleep = new NoSleep();

    function enableNoSleep() {
        noSleep.enable();
        document.removeEventListener('touchstart', enableNoSleep, false);
    }

    // Enable wake lock.
    // (must be wrapped in a user input event handler e.g. a mouse or touch handler)
    document.addEventListener('touchstart', enableNoSleep, false);
    if($cookies.get("spelarnamn") == null){
        changeUsername();
    }
    $scope.showHighscore = showHighscore;
    $scope.changeUsername = changeUsername;
    $rootScope.oldN = 0;
    $scope.history = [{n:0, arrows:0}];
    $scope.username = $cookies.get("spelarnamn");
    $scope.arrows = 0;
    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };
    $scope.visible = true;
    $scope.toggleVisible = function(){
        $scope.visible = !$scope.visible;
    }
    $scope.playing = false
    $scope.play = function(){
        if($scope.playing){
            $("#myvideo")[0].pause();
        }else{
            $("#myvideo")[0].play();
        }
        $scope.playing = !$scope.playing;
    }
    $scope.$on("undo", function(){
        if($scope.history.length > 1){
            $scope.history.pop();
            var item = $scope.history[$scope.history.length-1];
            $rootScope.oldN = item.n;
            $scope.arrows = item.arrows;
        }
    })
    $scope.$on("clicked", function(event, n){
        var position = $("#arrows").position();
        var original = $("#points-"+n);
        var cloned = original.clone();
        var oldN = $rootScope.oldN;
        if(n == 0){
            cloned.text("3");
        }
        cloned.attr("id", "");
        cloned.appendTo("body");
        cloned.css("position", "absolute");
        cloned.css("top", original.offset().top);
        cloned.css("left", original.offset().left);
        cloned.animate({top:position.top, left:position.left}, function(){
            
            cloned.remove();
            if(n == 20){
                if(n-oldN == 3){
                    saveHighscoreModal();
                }else{
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'templates/modal.html',
                        controller: function($scope){
                            $scope.oldN = oldN;
                            $scope.pressNumber = function(number){
                                //alert(($scope.arrows+number)+" pilar användes");
                                $scope.$parent.arrows+=number;
                                modalInstance.dismiss('cancel');
                                saveHighscoreModal();
                                //window.location.reload();
                                //return;
                            }
                            $scope.cancel = function(){
                                modalInstance.dismiss('cancel');
                            }
                        },
                        //controllerAs: '$ctrl',
                        //size: size,
                        resolve: {
                            items: function () {
                                return ["item1", "item2"]
                            }
                        }
                    });
                }
            }else{
                $scope.arrows += 3;
                var historyN = n;
                if(n == 0){
                    historyN = oldN;
                }
                $scope.history.push({n:historyN,arrows:$scope.arrows});
                $scope.$apply();
            } 
        });     
    })
    
}
angular.module("app")
.directive('myApp', function() {
    return {
        templateUrl: 'templates/app.html',
        controller:controller,
        replace:true 
    };
})