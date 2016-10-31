<?php
function dbConnect(){
	// Create connection
	$con=mysqli_connect("localhost","frankyboy_se","", "frankyboy_se") or die("error");

	// Check connection
	if (mysqli_connect_errno($con)){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
		return null;
	}
	return $con;
}
?>
