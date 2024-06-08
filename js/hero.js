
class Hero extends Entity{

	constructor(map, x, y) {
		super(map, x, y);
		this.SPEED = 528;
		
		this.health = 200;
		this.maxHealth = 200;
		this.image = loader.getImage('hero');
		
		this.items = [];
		this.canCraft = false;
		this.createCraftTxt();
	}
	nbItem(itemId){
		let cpt = 0;
		for(let i = 0; i < this.items.length; i++){
			if(this.items[i].id === itemId){
				cpt++;
			}
		}
		return cpt;
	}
	hasItem(itemId){
		for(let w = 0; w < this.items.length; w++){
			if(this.items[w].id == itemId){
				return true;
			}
		}
		return false;
	}
	vider(){
		if(this.items.length > 0){
			this.removeItem(this.items[this.items.length-1].id);
		}
	}
	addItem(itemId){
		var item = "";
		var isItem = false;
		var text;
		if(itemId < 26){
			item = Item.getItem(itemId);
			item.nbItem--;
			isItem = true;
			text = inventaireTxt.children[0];
			
		}else{
			item = Craft.getCraft(itemId);
			text = inventaireTxt.children[1];
		}
		
		if(this.items.indexOf(item) >= 0){
			text.innerHTML = text.innerHTML.replace(item.name + " x" + this.nbItem(itemId), item.name + " x" + (this.nbItem(itemId) + 1));
		}else{
			text.innerHTML = text.innerHTML + "<div style='cursor: grab;' onclick='game.hero.removeItem(" + item.id + ")'>" + item.name + " x1</div>";
			
		}
		this.items.push(item);
		this.refreshTxt();
		this.checkCraftTxt();				

	}
	
	removeItem(itemId){
		var item = "";
		var text; 
		if(itemId < 26){
			item = Item.getItem(itemId);
			text = inventaireTxt.children[0];
		}else{
			item = Craft.getCraft(itemId);
			text = inventaireTxt.children[1];
		}
		for(var i = this.items.length-1; i >= 0; i--){
			if(this.items[i].id === itemId){
				this.items.splice(this.items.indexOf(item), 1);
				if(this.nbItem(itemId) > 0){
					text.innerHTML = text.innerHTML.replace(item.name + " x" + (this.nbItem(itemId) +1), item.name + " x" + (this.nbItem(itemId)));
				}else{
					text.innerHTML = text.innerHTML.replace('<div style="cursor: grab;" onclick="game.hero.removeItem(' + item.id + ')">' + item.name + ' x1</div>', "");
				}
				i = -1;
			}	
		}
		this.checkCraftTxt();				

		this.refreshTxt();
	}
	
	craftObj(objId){
		let craftSound = new Audio("assets/craft.mp3");

		var itemToCraft = Craft.getCraft(objId);
		var itemToRemove = itemToCraft.itemsNeeded;
		for(var j = 0; j < itemToRemove.length; j++){
			this.removeItem(itemToRemove[j].id);
		}
		if(objId === 38){
			victoire = true;
		}
		this.addItem(objId);
		//hasCraft = true;
		craftSound.play();

		this.checkCraftTxt();				
	}
	itemsCraftable(){
		var itemsCraftable = [];
		
		// loops through all craftables items
		for(var i = 0; i < Craft.crafts.length; i++){
			var craft = Craft.crafts[i];
			// Get items needed for crafting
			var itemsManquant = craft.itemsNeeded;
			// loop though all items Needed
			var found = [];
			for(var s = 0; s < itemsManquant.length; s++){
				found.push(false);
			}
			for(var t = 0; t < itemsManquant.length; t++){
				
				var itemManquant = itemsManquant[t];
				// Check if player have this item
				for(var x = 0; x < this.items.length; x++){
					if(this.items[x].id === itemManquant.id){
						found[t] = true;
					}
				}
							
			}
			var craftable = true;
			for(var t = 0; t < found.length; t++){
				if(found[t] == false){
					craftable = false;
				}
			}
			if(craftable){
				
				itemsCraftable.push(craft);
			}
		}
		return itemsCraftable;

	}

	move(delta, dirx, diry){
		super.move(delta, dirx, diry)
		this.checkCraftTxt();

		// check if we walk on an item
		this._takeItem(dirx, diry);
	}
	

	_takeItem(dirx, diry){
		
		var left = this.x - this.width / 2;
		var right = this.x + this.width / 2 - 1;
		var top = this.y - this.height / 2;
		var bottom = this.y + this.height / 2 - 1;
		
		var item = this.map.isItem(left, right, top, bottom);
		
		this.canCraft = false;

		if(typeof item !== "undefined"){
			
			// Sur le constructeur
			if(item[3] === 40){	
				if(this.itemsCraftable().length > 0){
					this.canCraft = true;
				}
			}else{//Sur un item de la map

				map.setTile(item[0], item[1], item[2],0);
				this.addItem(item[3]);
				
				let itemSound = new Audio("assets/item.mp3");
				itemSound.play();
			}
		}
		
	}	
	
	checkCraftTxt(){
		var craftDispo = this.itemsCraftable();
		var txt = document.getElementById('craftList');
		for(let j = 0; j < Craft.crafts.length; j++){
			let nbItem = Craft.crafts[j].itemsNeeded.length;
			var craftTxt = document.getElementById("ctn" + j);
			if(craftDispo.indexOf(Craft.crafts[j]) !== -1 && this.canCraft){
				craftTxt.children[0].children[1].children[1].setAttribute("class", "btnDispo");
				craftTxt.children[0].children[1].children[1].setAttribute("onClick", "game.hero.craftObj(" + Craft.crafts[j].id + ")");
			}else{
				craftTxt.children[0].children[1].children[1].setAttribute("class", "btnPasDispo");
				craftTxt.children[0].children[1].children[1].setAttribute("onClick", "");
			}
		}
	}
	refreshTxt(){
		var craftDispo = this.itemsCraftable();

		var txt = document.getElementById('craftList');
		for(let j = 0; j < Craft.crafts.length; j++){
			let nbItem = Craft.crafts[j].itemsNeeded.length;
			var craftTxt = document.getElementById("ctn" + j);
			if(craftDispo.indexOf(Craft.crafts[j]) !== -1){
				craftTxt.style.color = "green";
			}else{
				craftTxt.style.color = "gray";
			}
			for(let i = 0; i < nbItem; i++){
				var itemTxt = document.getElementById("craft" + j + "item" + i);
				if(this.hasItem(Craft.crafts[j].itemsNeeded[i].id)){
					itemTxt.style.color = "green";
				}else{
					itemTxt.style.color = "black";
				}
			}
		}
	}
	createCraftTxt(){
		
		var craftDispo = this.itemsCraftable();
		
		var txt = document.createElement("div");
		txt.setAttribute('id', 'craftList');
		craftTxt.innerHTML = "<h1>Crafts Disponibles</h1>";
		craftTxt.appendChild(txt);
		
		for(let j = 0; j < Craft.crafts.length; j++){
			let nbItem = Craft.crafts[j].itemsNeeded.length;
			
			var ctnTxt = document.createElement('div');
			ctnTxt.setAttribute("class", "craftListItem");
			ctnTxt.style.color = "gray";
			ctnTxt.setAttribute("id", "ctn" + j);
			var box1 = document.createElement('div');
			box1.setAttribute("class","box1");
			var box2 = document.createElement('div');
			box2.setAttribute("class","box2");

			var craftName = document.createElement('div');
			craftName.innerHTML = "<b>"+ Craft.crafts[j].name.toUpperCase() +"</b>";
			var btnRecette = document.createElement('button');
			btnRecette.innerHTML = "Recette";
			btnRecette.setAttribute("class", "btnDispo");
			var btnCraft = document.createElement('button');
			btnCraft.innerHTML = "Crafter";
			btnCraft.setAttribute("class", "btnPasDispo");
			var boxBtn = document.createElement("div");
			box1.appendChild(craftName);
			boxBtn.appendChild(btnRecette);
			boxBtn.appendChild(btnCraft);
			box1.appendChild(boxBtn);
			ctnTxt.appendChild(box1);
			ctnTxt.appendChild(box2);

			txt.appendChild(ctnTxt);
			btnRecette.setAttribute('onclick', 'hideContainer("ctn' + j+'")');
			
			for(let i = 0; i < nbItem; i++){
				
				var itemTxt = document.createElement('div');
				itemTxt.setAttribute('id', "craft"+j+'item' +i);
				itemTxt.style.display = "block";
				
				itemTxt.innerHTML = Craft.crafts[j].itemsNeeded[i].name;
				box2.appendChild(itemTxt);
				box2.style.display = "none";
			}
		}
		
	}
	render(){
		// hero
		game.ctx.drawImage(
				this.image,
				this.screenX - this.width / 2,
				this.screenY - this.height / 2, this.width, this.height);
		
		
	}
	
	renderMinMap(){
		game.ctx.drawImage(loader.getImage('map'),(canvasSize - canvasSize/5), (canvasSize - canvasSize/5), canvasSize/5,canvasSize/5);
		
		game.ctx.drawImage(
				loader.getImage('heroMinMap'),
				(canvasSize - canvasSize/4.9) + ((this.x)/(canvasSize/(canvasSize/46))),
				(canvasSize - canvasSize/5.5) + ((this.y)/(canvasSize/(canvasSize/46))), this.height/7, this.height/7);
		/*game.ctx.drawImage(
				loader.getImage('heroMinMap'),
				canvasSize - canvasSize/5 + this.x/5,
				canvasSize - canvasSize/5 + this.y/5, this.height/7, this.height/7);*/
	}
	
	drawUI(delta){
		/*
		game.ctx.textAlign = "start"; 

		
		game.ctx.fillStyle = "red";
		game.ctx.strokeStyle='red'

		game.ctx.font = "30px Arial";
		game.ctx.fillText("Pos: [" +Math.floor(this.x)+ "," + Math.floor(this.y)+  "]", 5, canvas.height-15);

		game.ctx.strokeText("Pos: [" +Math.floor(this.x)+ "," + Math.floor(this.y)+  "]", 5, canvas.height-15);
		var index = 10;
		// items
		for(var i = 0; i < this.items.length ; i++){
			
			if(this.items[i].id > 25){
				if(loader.getImage(this.items[i].id) != null){
						game.ctx.drawImage(
						loader.getImage(this.items[i].id),
						index, 10, this.height, this.height);
				}
				else{
					game.ctx.font = "30px Arial";

					game.ctx.fillText(this.items[i].id, index, 50);
				}
					index+= this.height+10;
			}
		}*/
	}
}