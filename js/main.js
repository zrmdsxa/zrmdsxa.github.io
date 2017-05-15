$(document).ready(function(){

	dBug("Document is ready");
	$('#mainnav').load("html/navbar.html");
	dBug("navbar loaded");

	function dBug(data){
		console.log(data);
	}
});