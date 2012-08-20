
var TARGET_AUDIENCE = "target-audience";
var TECHNOLOGIES_AND_DEVICES = "technologies-and-devices";
var SERVICE_AND_SOCIAL_MEDIA = "service-and-social-media";

var TARGET_AUDIENCE_VALUES = ["Kids 3 - 7", "Kids 8 - 12", "Teenagers 13 - 19", "Students", "Hipsters", "Young couples without kids", "Parents"];
var TECHNOLOGIES_AND_DEVICES_VALUES = ["E-mail", "Sound recording", "Camera (photo)", "Geolocation", "Camera (video)", "Sms", "Mms", "RSS"];
var SERVICE_AND_SOCIAL_MEDIA_VALUES = ["Skype", "Twitter", "Foursquare", "Facebook", "LinkedIn", "Google Maps", "Flickr", "Skype2", "Twitter2", "Foursquare2", "Facebook2", "LinkedIn2", "Google Maps2", "Flickr2"];

var cardGrid = new CardGrid(new Array(TARGET_AUDIENCE, TECHNOLOGIES_AND_DEVICES, SERVICE_AND_SOCIAL_MEDIA));
var cardOptions = new CardOptionCollection();

$("#shuffle-button").click(function(e) {
	e.preventDefault();
	shuffleCards(TARGET_AUDIENCE);
	shuffleCards(TECHNOLOGIES_AND_DEVICES);
	shuffleCards(SERVICE_AND_SOCIAL_MEDIA);
});

function shuffleCards(type) {

	var keyListCopy = cardOptions.getKeyList(type).slice();
	var cardList = cardGrid.getCards(type);
	
	//remove locked options
	for(var i=0; i < cardList.length; i++) {
		if(cardList[i].isLocked()) {
			var index = $.inArray(cardList[i].getOption().getId(), keyListCopy);
			if(index != -1) {
				keyListCopy.splice(index,1);
			}
		}
	}
	
	//Shuffle unlocked options
	for(var i=0; i < cardList.length; i++) {
	
		if(!cardList[i].isLocked()) {
			var randIndex = Math.floor(Math.random()*keyListCopy.length);
			var optionKey = keyListCopy.splice(randIndex,1);
			cardList[i].setOption(cardOptions.getById(optionKey));
			cardList[i].setLocked(false);
			renderCard(cardList[i]);
		}
	}
}

function renderCard(card) {

	var elmId = "#"+card.getId();
	var labelElm = $(elmId).find(".label");
	//var lockElm = $(elmId).find(".lock-button");
	
	$(labelElm).html(card.getValue());
	
	if(card.isStatic()) {
		$(elmId).attr("class", "shuffle-card static");
		return;
	}
	else if(card.isLocked()) {
		$(elmId).attr("class", "shuffle-card locked");
		return;
	}
	else if(card.isSelected()) {
		$(elmId).attr("class", "shuffle-card selected");
		return;
	}
	else {
		$(elmId).attr("class", "shuffle-card inactive");
		return;
	}
	
	
	
	/*if(card.isStatic()) {
		$(labelElm).html(card.getValue());
		$(elmId).addClass("static");
		$(elmId).removeClass("selected");
		$(elmId).removeClass("inactive");
		$(elmId).removeClass("locked");
		return;
	}
	else {
		$(elmId).removeClass("static");
	}
	
	if(card.isLocked()) {
		$(elmId).addClass("locked");
		$(elmId).removeClass("inactive");
		$(elmId).removeClass("selected");
	}
	else {
		$(elmId).removeClass("locked");
	}
	
	if(card.isSelected()) {
		$(labelElm).html(card.getValue());
		$(elmId).addClass("selected");
		$(elmId).removeClass("inactive");
	}
	else {
		$(labelElm).html("");
		$(elmId).removeClass("selected");
		$(elmId).addClass("inactive");
		return;
	}*/
	

}

function renderCardList(type) {

	var listElm = null;
	if(type == TARGET_AUDIENCE)
		listElm = $("#card-option-list-1");
	else if(type == TECHNOLOGIES_AND_DEVICES)
		listElm = $("#card-option-list-2");
	else
		listElm = $("#card-option-list-3");

	//clear list
	$(listElm).html("");
	
	var optionKeyList = cardOptions.getKeyList(type);
	for(var i=0; i < optionKeyList.length; i++) {
		
		var option = cardOptions.getById(optionKeyList[i]);
		var listOptionElm = $("<li><a href='" + option.getId() + "'>" + option.getValue() + "</a></li>");
		$(listElm).append(listOptionElm);
		
		$(listOptionElm).find("a").click(function(e) {
			e.preventDefault();
			
			if($(this).hasClass("disabled"))
				return false;
			
			var cardsInColumn = cardGrid.getCards(option.getType());
			var optionId = $(this).attr("href");
			var cardOption = cardOptions.getById(optionId);
			
			for(var i=0; i < cardsInColumn.length; i++) {
				if(!cardsInColumn[i].isStatic()) {
					cardsInColumn[i].setStatic(true);
					cardsInColumn[i].setOption(cardOption);
					renderCard(cardsInColumn[i]);
					$("#"+option.getType()).addClass("static");
					setExpandColumn(option.getType(), false);
					break;
				}
			}
		});
	}
}

function selectCard(id) {

	var card = cardGrid.getCardById(id);
	if(card.isLocked())
		return;
	if(card.isSelected())
		card.setSelected(false);
	else
		card.setSelected(true);
	
	renderCard(card);
}

function removeCard(id) {

	var card = cardGrid.getCardById(id);
	card.setStatic(false);
	card.setLocked(false);
	
	var columnCards = cardGrid.getCards(card.getType());
	var colIsStatic = false; 
	for(var i=0; i < columnCards.length; i++) {
		if(columnCards[i].isStatic()) {
			colIsStatic = true;
			break;
		}
	}
	
	if(!colIsStatic)
		$("#"+card.getType()).removeClass("static");
		
	renderCard(card);
}

function toggleCard(id) {

	var card = cardGrid.getCardById(id);
	if(card.isLocked())
		card.setLocked(false);
	else
		card.setLocked(true);
				
	renderCard(card);
}

function setExpandColumn(columnId, flag) {

	var colElm = $("#"+columnId);
	if($(colElm).hasClass("expanded") && !flag) {
		$(colElm).removeClass("expanded");
	}
	else if(!$(colElm).hasClass("expanded") && flag) {
	
		//Close other windows
		if(columnId != TARGET_AUDIENCE)
			setExpandColumn(TARGET_AUDIENCE, false);
		if(columnId != TECHNOLOGIES_AND_DEVICES)
			setExpandColumn(TECHNOLOGIES_AND_DEVICES, false);
		if(columnId != SERVICE_AND_SOCIAL_MEDIA)
			setExpandColumn(SERVICE_AND_SOCIAL_MEDIA, false);
	
		var columnCards = cardGrid.getCards(columnId);
		
		//Check if all are static
		var allIsStatic = true;
		for(var i=0; i < columnCards.length; i++) {
			if(!columnCards[i].isStatic()) {
				allIsStatic = false;
				break;
			}
		}
		
		$(colElm).find("a").each(function(index) {
			
			//Disable always if 3 static
			if(allIsStatic) {
				$(this).addClass("disabled");
			}
			else {
				//Disable if already selected
				$(this).removeClass("disabled");
				for(var i=0; i < columnCards.length; i++) {
					if(columnCards[i].isStatic() && $(this).html() == columnCards[i].getValue()){
						$(this).addClass("disabled");
						break;
					}
				}
			}
		});
		
		$(colElm).addClass("expanded");
		$($(colElm).find('.scroll-pane')).jScrollPane();
	}
}

$(document).ready(function() {
	
	/*
	 * INIT OPTIONS
	 */
	for(var i=0; i < TARGET_AUDIENCE_VALUES.length; i++) {
		var optionId = TARGET_AUDIENCE + "_" + i;
		cardOptions.put(optionId, new CardOption(optionId, TARGET_AUDIENCE, TARGET_AUDIENCE_VALUES[i]));
	}
	
	for(var i=0; i < TECHNOLOGIES_AND_DEVICES_VALUES.length; i++) {
		var optionId = TECHNOLOGIES_AND_DEVICES + "_" + i;
		cardOptions.put(optionId, new CardOption(optionId, TECHNOLOGIES_AND_DEVICES, TECHNOLOGIES_AND_DEVICES_VALUES[i]));
	}
	
	for(var i=0; i < SERVICE_AND_SOCIAL_MEDIA_VALUES.length; i++) {
		var optionId = SERVICE_AND_SOCIAL_MEDIA + "_" + i;
		cardOptions.put(optionId, new CardOption(optionId, SERVICE_AND_SOCIAL_MEDIA, SERVICE_AND_SOCIAL_MEDIA_VALUES[i]));
	}
	
	/*
	 * INIT CARDS
	 */
	for(var i = 0; i < 3; i++) {
		cardGrid.putCard(TARGET_AUDIENCE, new Card(TARGET_AUDIENCE + "_" + i));
		cardGrid.putCard(TECHNOLOGIES_AND_DEVICES, new Card(TECHNOLOGIES_AND_DEVICES + "_" + i));
		cardGrid.putCard(SERVICE_AND_SOCIAL_MEDIA, new Card(SERVICE_AND_SOCIAL_MEDIA + "_" + i));
		
		$(".col-1").append($('<div id="' + TARGET_AUDIENCE + "_" + i + '" class="shuffle-card"><p class="label"></p><a href="#" class="lock-button"></a><a href="#" class="remove-button"></a></div>'));
		$(".col-2").append($('<div id="' + TECHNOLOGIES_AND_DEVICES + "_" + i + '" class="shuffle-card"><p class="label"></p><a href="#" class="lock-button"><a href="#" class="remove-button"></a></a></div>'));
		$(".col-3").append($('<div id="' + SERVICE_AND_SOCIAL_MEDIA + "_" + i + '" class="shuffle-card"><p class="label"></p><a href="#" class="lock-button"><a href="#" class="remove-button"></a></a></div>'));
	}
	
	//Add card listeners
	var cards = cardGrid.getCards();
	for(var i=0; i < cards.length; i++) {
		
		var elmId = "#"+cards[i].getId();
		$(elmId).click(function(e) {
			e.preventDefault();
			var id = $(this).attr("id");
			
			if($(this).hasClass("static"))
				removeCard(id);
			else
				selectCard(id);
			
			return false;
		});
		
		$(elmId).find(".lock-button").click(function(e) {
			e.preventDefault();
			var id = $(this).parent().attr("id");
			toggleCard(id);
			return false;
		});
	}
	
	//Add expand option list listeners
	$($($(".col-header").get(0)).parent()).attr("id", TARGET_AUDIENCE);
	$($($(".col-header").get(1)).parent()).attr("id", TECHNOLOGIES_AND_DEVICES);
	$($($(".col-header").get(2)).parent()).attr("id", SERVICE_AND_SOCIAL_MEDIA);
	
	$(".col-header").click(function(e) {
		e.preventDefault();
		var id = $($(this).parent()).attr("id");
		
		if($($(this).parent()).hasClass("expanded"))
			setExpandColumn(id, false);
		else
			setExpandColumn(id, true);
			
		return false;
	});
	
	$("#shuffle-button").click(function(e) {
		
		e.preventDefault();
	
		setExpandColumn(TARGET_AUDIENCE, false);
		setExpandColumn(TECHNOLOGIES_AND_DEVICES, false);
		setExpandColumn(SERVICE_AND_SOCIAL_MEDIA, false);
		
		shuffleCards(TARGET_AUDIENCE);
		shuffleCards(TECHNOLOGIES_AND_DEVICES);
		shuffleCards(SERVICE_AND_SOCIAL_MEDIA);
	});
	
	renderCardList(TARGET_AUDIENCE);
	renderCardList(TECHNOLOGIES_AND_DEVICES);
	renderCardList(SERVICE_AND_SOCIAL_MEDIA);
	
	//Set initial state
	shuffleCards(TARGET_AUDIENCE, TARGET_AUDIENCE_VALUES);
	shuffleCards(TECHNOLOGIES_AND_DEVICES, TECHNOLOGIES_AND_DEVICES_VALUES);
	shuffleCards(SERVICE_AND_SOCIAL_MEDIA, SERVICE_AND_SOCIAL_MEDIA_VALUES);
	
	selectCard(cardGrid.getCards(TARGET_AUDIENCE)[0].getId());
	selectCard(cardGrid.getCards(TECHNOLOGIES_AND_DEVICES)[1].getId());
	selectCard(cardGrid.getCards(SERVICE_AND_SOCIAL_MEDIA)[2].getId());
	
	//Add functions for rezise of window
	window.onresize = function(e) {
		setExpandColumn(TARGET_AUDIENCE, false);
		setExpandColumn(TECHNOLOGIES_AND_DEVICES, false);
		setExpandColumn(SERVICE_AND_SOCIAL_MEDIA, false);
	}
});