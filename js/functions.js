
function afficherInventaire(){
	if(inventaireTxt.style.display === 'none'){
		btn.innerHTML = "<b>-</b>";
		inventaireTxt.style.display = 'flex';
	}else{
		btn.innerHTML = "<b>+</b>";
		inventaireTxt.style.display = 'none';
	}
}

function hideContainer(containerId){
	let box = document.getElementById(containerId);
	
	let child = box.children[1];
	if(child.style.display === 'none'){
		child.style.display = 'flex';
	}else{
		child.style.display = 'none';
	}
	
}
function afficherEscapeMenu(){
	paused = true;
	let escapeMenu = document.getElementById("overlay");
	escapeMenu.style.top = "0";
	document.body.style.overflow = "hidden";
	window.scrollTo(0, 0);
}

function cacherEscapeMenu(){
	paused = false;
	let escapeMenu = document.getElementById("overlay");
	escapeMenu.style.top = "-2000px";
	document.body.style.overflow = "";
}

function showControls(){
	let ctrl = 	document.getElementById("ctrl");
	ctrl.style.top = "0";
}

function hideControls(){
	let ctrl = 	document.getElementById("ctrl");
	ctrl.style.top = "-2000px";
}

function showInstructions(){
	let ctrl = 	document.getElementById("Instructions");
	ctrl.style.top = "0";
}

function hideInstrutions(){
	let ctrl = 	document.getElementById("Instructions");
	ctrl.style.top = "-2000px";
}
function showCredits(){
	let ctrl = 	document.getElementById("Credits");
	ctrl.style.top = "0";
}

function hideCredits(){
	let ctrl = 	document.getElementById("Credits");
	ctrl.style.top = "-2000px";
}
