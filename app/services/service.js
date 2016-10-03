angular.module("app").service('myService', function($http) {
    this.getHighscore = function(id, range) {
        if(range == "Idag"){
            return $http.get('actions.php?method=getDaily&id='+id);
        }else if(range == "Vecka"){
            return $http.get('actions.php?method=getWeekly&id='+id);
        }else if(range == "Månad"){
            return $http.get('actions.php?method=getMonthly&id='+id);
        }else{
            return $http.get('actions.php?method=getAlltime&id='+id);
        } 
    };
    this.saveHighscore = function(username, points){
        return $http.get('actions.php?method=save&username='+username+"&points="+points);
    }
    this.removeHighscore = function(id){
        return $http.get('actions.php?method=delete&id='+id);
    }
});