function CardOption(id, type, value) {
	this.id = id;
	this.value = value;
	this.type = type;
	
	this.getId = function() { return this.id; }
	this.getValue = function() { return this.value; }
	this.getType = function() { return this.type; }
	this.setValue = function(value) { this.value = value; }
	
	this.toString = function() {
		return "Id:" + this.id + " type:" + this.type + " value:" + this.value;
	}
}

function Card(id) {
	this.id = id;
	this.option = null;
	this.selected = false;
	this.locked = false;
	this.staticFlag = false;
	
	this.getId = function() { return this.id; }
	
	this.getValue = function() {
		if(this.option)
			return this.option.getValue();
		else
			return "-";
	}
	
	this.getType = function() {
		if(this.option)
			return this.option.getType();
		else
			return "-";
	}
	
	this.getOption = function() { return this.option; }
	this.isSelected = function() { return this.selected; }
	this.isLocked = function() { return this.locked; }
	this.isStatic = function() { return this.staticFlag; }
	this.setSelected = function(flag) { this.selected = flag; }
	this.setLocked = function(flag) { this.locked = flag; }
	this.setStatic = function(flag) { this.staticFlag = flag; }
	this.setOption = function(option) { this.option = option; }
	
	this.toString = function() {
		return "Id:" + this.id + " type:" + this.getType() + " value:" + this.getValue() + " selected:" + this.selected + " locked:" + this.locked;
	}
}

function CardOptionCollection() {
	
	this.cardOptions = {};
	this.getById = function(id) { return this.cardOptions[id]; }
	this.put = function(id, cardOption) { this.cardOptions[id] = cardOption; }
	this.remove = function(id) { this.cardOptions[id] = null; }
	
	this.getKeyList = function(type) {
	
		var keys = Object.keys(this.cardOptions);
		if(!type)
			return keys;
		
		var filteredKeys = [];
		for(var i=0; i < keys.length; i++) {
			if(this.cardOptions[keys[i]].getType() == type)
				filteredKeys.push(this.cardOptions[keys[i]].getId());
		}
		
		return filteredKeys;
	}
}

function CardGrid(columns) {

	this.grid = {};
	
	for(var i=0; i < columns.length; i++)
		this.grid[columns[i]] = [];
		
	this.putCard = function(type, card) {
		if(this.grid[type])
			this.grid[type].push(card);
	}
	
	this.getCards = function(type) {
		
		if(!type) {
		
			var keyList = Object.keys(this.grid);
			var cards = [];
			for(var i=0; i < keyList.length; i++)
				cards = cards.concat(this.grid[keyList[i]]);
		
			return cards;
		}
			
		if(this.grid[type])
			return this.grid[type];
	}
	
	this.getCardById = function(id) {
	
		var keyList = Object.keys(this.grid);
		for(var i=0; i < keyList.length; i++) {
			for(var j=0; j < this.grid[keyList[i]].length; j++) {
				if(this.grid[keyList[i]][j].getId() == id)
					return this.grid[keyList[i]][j];
			}
		}
		
		return null;
	}
}