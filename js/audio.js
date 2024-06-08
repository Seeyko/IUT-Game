// JavaScript Document
class Sound{
	constructor(src){
		this.snd = new Audio("assets/" + src + ".mp3");
		
	}
	
	play(){
		this.snd.play();
	}
	
}
