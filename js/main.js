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
    	document.getElementById("main").style.marginLeft = "110px";
    	menu = false;
    }
    else{
    	document.getElementById("sidenav").style.left = "0px";
    	document.getElementById("sidenav").style.textAlign = "center";
    	document.getElementById("main").style.marginLeft = "350px";
    	menu = true;
    }
}