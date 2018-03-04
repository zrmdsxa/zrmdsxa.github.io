$(document).ready(function(){

	$("#a-games").click(function(event){
		dBug("Games clicked");
		document.getElementById("portfolio-games").style.display = "block";
		dBug("Games loaded");
		document.getElementById("portfolio-models").style.display = "none";
		dBug("Models hidden");
		document.getElementById("portfolio-other").style.display = "none";
		dBug("Other hidden");
	});

	$("#a-models").click(function(event){
		dBug("Models clicked");
		document.getElementById("portfolio-models").style.display = "block";
		dBug("Models loaded");
		document.getElementById("portfolio-games").style.display = "none";
		dBug("Games hidden");
		document.getElementById("portfolio-other").style.display = "none";
		dBug("Other hidden");
	});

	$("#a-other").click(function(event){
		dBug("Other clicked");
		document.getElementById("portfolio-other").style.display = "block";
		dBug("Other loaded");
		document.getElementById("portfolio-models").style.display = "none";
		dBug("Models hidden");
		document.getElementById("portfolio-games").style.display = "none";
		dBug("Games hidden");

	});


	function dBug(data){
		console.log(data);
	}
});