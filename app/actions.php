<?php
	session_start();
	include 'connect.php';
	if($_REQUEST["method"] == "save"){
		$myCon = dbConnect();
		$uuidSql = "SELECT UUID() as id";
		$result = mysqli_query($myCon, $uuidSql);
		$row = mysqli_fetch_array($result);
		$uuid = $row["id"];
		$sql = "INSERT INTO dart (id, username, points) VALUES('$uuid', ?, ?)";
		$stmt = mysqli_stmt_init($myCon);
		mysqli_stmt_prepare($stmt, $sql);
		mysqli_stmt_bind_param($stmt, "si", $_REQUEST['username'], $_REQUEST['points']);
		mysqli_stmt_execute($stmt);
		mysqli_close($myCon);
		echo $uuid;
	}else if($_REQUEST["method"] == "delete"){
		$myCon = dbConnect();
		$sql = "DELETE FROM dart WHERE id=?";
		$stmt = mysqli_stmt_init($myCon);
		mysqli_stmt_prepare($stmt, $sql);
		mysqli_stmt_bind_param($stmt, "s", $_REQUEST['id']);
		mysqli_stmt_execute($stmt);
		mysqli_close($myCon);
	}else{
		$myCon = dbConnect();
		header('Content-type: application/json');
		if($_REQUEST["method"] == "getDaily"){ 
			$extraSql = "WHERE DATE(  `timestamp` ) = CURDATE( )";
		}else if($_REQUEST["method"] == "getWeekly"){
			$extraSql = "WHERE YEARWEEK(`timestamp`, 1) = YEARWEEK(CURDATE(), 1)";
		}else if($_REQUEST["method"] == "getMonthly"){
			$extraSql = "WHERE MONTH( TIMESTAMP ) = MONTH( CURDATE( ) )";
		}else if($_REQUEST["method"] == "getAlltime"){
			$extraSql = "";
		}
		$sql = "select id,timestamp, username, points, case when @score  != points then @rank := @rank+1 else @rank end as rank,
		@score:= points as dummy_value
		from (
		select points, id, timestamp, username from dart,(select @rank:=1, @score:=NULL) as vars
		order by points asc) as h $extraSql";
		//$sql="SELECT * FROM dart ".$extraSql." order by points ASC LIMIT 20";
		$result=mysqli_query($myCon,$sql." limit 15");
		if (!$result) {
	    	printf("Error: %s\n", mysqli_error($myCon));
	    	exit();
		}
		$returnObj = array();
		$found = false;
		while($row = mysqli_fetch_array($result)){
			$temp = new stdClass;
			$temp->username = $row["username"];
			$temp->points = $row["points"];
			$temp->timestamp = $row["timestamp"];
			$temp->rank = $row["rank"];
			if($row["id"] == $_REQUEST["id"]){
				$temp->current = true;
				$found = true;
			}
			$returnObj[] = $temp;
		}
		if(!$found){
			$sql = "select * from ($sql) as b where id = '".$_REQUEST["id"]."'";
			$result=mysqli_query($myCon,$sql);
			if (!$result) {
				printf("Error: %s\n", mysqli_error($myCon));
				exit();
			}
			$row = mysqli_fetch_array($result);
			$temp = new stdClass;
			$temp->username = $row["username"];
			$temp->points = $row["points"];
			$temp->timestamp = $row["timestamp"];
			$temp->rank = $row["rank"];
			$temp->current = true;
			$returnObj[] = $temp;
			
		}

		/* free result set */
		mysqli_free_result($result);

		/* close connection */
		mysqli_close($myCon);
		echo json_encode($returnObj);
	}
?>