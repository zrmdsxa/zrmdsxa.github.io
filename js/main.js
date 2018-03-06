$(document).ready(function(){

	dBug("Document is ready");
	$('#sidenav').load("html/navbar.html");

	dBug("navbar loaded");

	function dBug(data){
		console.log(data);
	}
});

var menu = false;

function MenuToggle(x) {
    x.classList.toggle("change");

    if (menu){
    	document.getElementById("sidenav").style.left = "-240px";
    	document.getElementById("sidenav").style.textAlign = "left";
    	menu = false;
    }
    else{
    	document.getElementById("sidenav").style.left = "0px";
    	document.getElementById("sidenav").style.textAlign = "center";
    	menu = true;
    }
}