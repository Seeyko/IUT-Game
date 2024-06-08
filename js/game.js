// JavaScript Document
// Game object
class Game{
	constructor(context){
		this.ctx = context;
		this.hasScrolled = true;
	}
	run(){
	    this._previousElapsed = 0;
		var p = this.load();
		Promise.all(p).then(function(loaded){
			this.init();
			//window.requestAnimationFrame(tick);
		}.bind(this));
	}
	
	init(){
		keyboard.listenForEvents(
        [keyboard.LEFT, keyboard.RIGHT, keyboard.UP, keyboard.DOWN, keyboard.SPRINT,keyboard.Z,keyboard.Q,keyboard.S ,keyboard.D, keyboard.ESCAPE]);
		
		//this.tileAtlas = loader.getAllImage();

		this.hero = new Hero(map, canvasSize*7, canvasSize*7.5);
		this.camera = new Camera(map, canvasSize, canvasSize);
		this.camera.follow(this.hero);
		
		window.requestAnimationFrame(tick);

	}
	update(delta){
	   // this.hasScrolled = false;

		// handle hero movement with arrow keys
		var dirx = 0;
		var diry = 0;
		this.hero.SPEED = canvasSize/2;
		if(keyboard.isDown(keyboard.SPRINT)){
			this.hero.SPEED = canvasSize/(canvasSize/100);
		}
		if(keyboard.isDown(keyboard.ESCAPE) && !paused){
			afficherEscapeMenu();
		}
		if (keyboard.isDown(keyboard.LEFT) || keyboard.isDown(keyboard.Q)) { dirx = -1; }
		else if (keyboard.isDown(keyboard.RIGHT) ||keyboard.isDown(keyboard.D)) { dirx = 1; }
		else if (keyboard.isDown(keyboard.UP) || keyboard.isDown(keyboard.Z)) { diry = -1; }
		else if (keyboard.isDown(keyboard.DOWN) || keyboard.isDown(keyboard.S)) { diry = 1; }
		
		
		if(dirx !== 0 || diry !== 0){
			this.hero.move(delta, dirx, diry);
	        this.hasScrolled = true;
		}
		this.camera.update();		
		
	}
	render(spawn, delta){
		if(this.hasScrolled){
			//draw map background layer
			this._drawLayer(0);		
			
			if(spawn === true){
				this.spawnItems();
				//draw decor and items
			}
			this.hero.render();

			this._drawLayer(1);
			this.hero.drawUI(delta);
			this.hero.renderMinMap();
		}
		this.hasScrolled = false;
	}
	
	spawnItems(){
		let items = Item.items;
		for(let i = 0; i < items.length; i++){
			let item = items[i];
			for(let j = 0; j < map.layers[1].length; j++){
				let spawnRate = (item.spawnRate/ item.nbItem) /2;
				if(map.layers[1][j] === 0 && map.layers[0][j] != 40){
					let rdn = Math.random();
					if(rdn <= spawnRate){
						//console.log(item.name + " spawnRate : " + item.spawnRate + " nombre sur map : " + item.nbItem + " chance de spawn = " + spawnRate);
						map.layers[1][j] = item.id;
						item.nbItem++;
					}
				}
			}
		}
	}
	load(){
		var loaded = [];
		
		loaded.push(loader.loadImage(0, "assets/" + 0 + ".png"));
		loaded.push(loader.loadImage(1, "assets/" + 1 + ".png"));

		loaded.push(loader.loadImage(2, "assets/" + 2 + ".png"));
		loaded.push(loader.loadImage(3, "assets/" + 3 + ".png"));
		loaded.push(loader.loadImage(4, "assets/" + 4 + ".png"));
		loaded.push(loader.loadImage(5, "assets/" + 5 + ".png"));
		loaded.push(loader.loadImage(6, "assets/" + 6 + ".png"));
		loaded.push(loader.loadImage(7, "assets/" + 7 + ".png"));
		loaded.push(loader.loadImage(8, "assets/" + 8 + ".png"));
		loaded.push(loader.loadImage(9, "assets/" + 9 + ".png"));
		loaded.push(loader.loadImage(10, "assets/" + 10 + ".png"));
		loaded.push(loader.loadImage(11, "assets/" + 11 + ".png"));
		loaded.push(loader.loadImage(12, "assets/" + 12 + ".png"));
		loaded.push(loader.loadImage(13, "assets/" + 13 + ".png"));
		loaded.push(loader.loadImage(14, "assets/" + 14 + ".png"));
		loaded.push(loader.loadImage(15, "assets/" + 15 + ".png"));
		loaded.push(loader.loadImage(16, "assets/" + 16 + ".png"));
		loaded.push(loader.loadImage(17, "assets/" + 17 + ".png"));
		loaded.push(loader.loadImage(18, "assets/" + 18 + ".png"));

		loaded.push(loader.loadImage(20, "assets/" + 20 + ".png"));
		loaded.push(loader.loadImage(21, "assets/" + 21 + ".png"));
		loaded.push(loader.loadImage(22, "assets/" + 22 + ".png"));
		loaded.push(loader.loadImage(23, "assets/" + 23 + ".png"));
		loaded.push(loader.loadImage(24, "assets/" + 24 + ".png"));
		loaded.push(loader.loadImage(25, "assets/" + 25 + ".png"));
		loaded.push(loader.loadImage(40, "assets/" + 40 + ".png"));
		loaded.push(loader.loadImage(41, "assets/" + 41 + ".png"));
		loaded.push(loader.loadImage(42, "assets/" + 42 + ".png"));
		loaded.push(loader.loadImage(43, "assets/" + 43 + ".png"));
		loaded.push(loader.loadImage(44, "assets/" + 44 + ".png"));
		loaded.push(loader.loadImage(46, "assets/" + 46 + ".png"));
		loaded.push(loader.loadImage(47, "assets/" + 47 + ".png"));

		loaded.push(loader.loadImage('?', 'assets/noimg.png'));

		loaded.push(loader.loadImage('hero', 'assets/player.png'));
		loaded.push(loader.loadImage('heroMinMap', 'assets/player.jpg'));

		loaded.push(loader.loadImage('map', 'assets/map.png'));
		return loaded;    	
	}

	_drawLayer(layer) {
		let startCol = Math.floor(this.camera.x / map.tsize);
		let endCol = startCol + ((this.camera.width+1)/map.tsize)+5;
		let startRow = Math.floor(this.camera.y/map.tsize);
		let endRow = startRow + ((this.camera.height+1)/map.tsize)+5;
		let offsetX = -this.camera.x + startCol * map.tsize;
		let offsetY = -this.camera.y + startRow * map.tsize;
		
		for (let c = startCol; c <= endCol; c++) {
			for (let r = startRow; r <= endRow; r++) {
				let tile = map.layers[layer][r * map.cols + c];
				let x = (c - startCol) * map.tsize + offsetX;
				let y = (r - startRow) * map.tsize + offsetY;
				if (typeof tile !== "undefined" ) {	
					if((layer === 1 && tile !== 0 && tile !== 1) || layer === 0){
						let img = loader.getImage(tile);
						if(img !== null){
							this.ctx.drawImage(
								img, // image
								Math.round(x),  // target x
								Math.round(y), // target y
								map.tsize, // target width
								map.tsize// target height
							);
						}
					}
				}
			}
		}
	};

}

function imageExists(url){
  var image = new Image();

    image.src = url;

    if (!image.complete) {
        return false;
    }
    else if (image.height === 0) {
        return false;
    }

    return true;
}