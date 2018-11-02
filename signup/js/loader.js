let loader = document.getElementById("screenLoader");

window.onload = function(){
	setTimeout(function(){
		loader.classList.add("done");
	},1000);
}