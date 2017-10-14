$(document).ready(function() {

	var gameObj = {
		"Current Name": "",
		"Current Health Points": 0,
		"Original Attack Power": 0,
		"Current Attack Power": 0,
		"Current Enemy Name": "",
		"Current Enemy Health Points": 0,
		"Current Enemy Counter Attack Power": 0,
		defender: false,
		gameEnded: false,

		characters: {
			"Obi-Wan Kenobi": {
				"Health Points": 120 ,
				"Attack Power": 8,
				"Counter Attack Power": 10,
				"Image":"assets/images/obi-wan.jpg"
			},
			"Luke Skywalker": {
				"Health Points": 100,
				"Attack Power": 15,
				"Counter Attack Power": 5,
				"Image":"assets/images/luke-skywalker.png"
			},
			"Darth Sidious": {
				"Health Points": 150,
				"Attack Power": 4,
				"Counter Attack Power": 20,
				"Image":"assets/images/darth-sidious.png"
			},
			"Darth Maul": {
				"Health Points": 180,
				"Attack Power": 2,
				"Counter Attack Power": 25,
				"Image":"assets/images/darth-maul.jpg"
			}
		},
		//Creates a div for each character that includes their name, image, style, and health. Places div in corresponding area.
		createBox: function(name, typeOfCharacterBox, appendDiv, health) {
			var characterDiv = $("<div>");
			characterDiv.addClass("box " + typeOfCharacterBox);
			characterDiv.attr("data-characterName", name);
			characterDiv.attr("data-healthPoints", gameObj.characters[name]["Health Points"]);
			characterDiv.attr("data-attackPower", gameObj.characters[name]["Attack Power"]);
			characterDiv.attr("data-counterAttackPower", gameObj.characters[name]["Counter Attack Power"]);
			var characterImage = $("<img>");
			characterImage.addClass("imageResize");
			characterImage.attr("src", gameObj.characters[name]["Image"]);
			$(characterDiv).append(name + "<br>");
			$(characterDiv).append(characterImage);
			if(gameObj.defender === false) {
				$(characterDiv).append("<br>" + gameObj.characters[name]["Health Points"]);
			}
			else {
				$(characterDiv).append("<br>" + health);
			};
			$(appendDiv).append(characterDiv);
		},
		//Resets the game to original state
		resetGame: function() {
			$(".chooseCharacter").empty();
			$("#yourCharacter").empty();
			$(".enemiesAvailable").empty();
			$("#defender").empty();
			$("#roundText").empty();
			$("#endText").empty();
			$("#restartButton").css("visibility", "hidden");
			gameObj.defender = false;
			gameObj.gameEnded = false;

			$.each(gameObj.characters, function(name) {
				gameObj.createBox(name, "chooseCharacterBox", ".chooseCharacter");
			});
		},
		//Choose a character and they will be set in your character area while other characters become enemies
		clickedCharacter: function(character) {
			gameObj["Current Name"] = $(character).attr("data-characterName");
			gameObj["Current Health Points"] = parseInt($(character).attr("data-healthPoints"));
			gameObj["Current Attack Power"] = parseInt($(character).attr("data-attackPower"));
			gameObj["Original Attack Power"] = parseInt($(character).attr("data-attackPower"));
			$(".chooseCharacter").empty();
			gameObj.createBox(gameObj["Current Name"], "yourCharacterBox", "#yourCharacter");
			$.each(gameObj.characters, function(otherCharacters) {
				if(otherCharacters !== gameObj["Current Name"]) {
					gameObj.createBox(otherCharacters, "enemiesAvailableBox", ".enemiesAvailable");
				};
			});
		},
		//Moves enemy to defender area
		clickedEnemy: function(character) {
			if(gameObj.defender === false && gameObj.gameEnded === false) {
				$("#endText").empty();
				gameObj["Current Enemy Name"] = $(character).attr("data-characterName");
				gameObj["Current Enemy Health Points"] = parseInt($(character).attr("data-healthPoints"));
				gameObj["Current Enemy Counter Attack Power"] = parseInt($(character).attr("data-counterAttackPower"));
				$("#roundText").html("You have entered the fray with " + gameObj["Current Enemy Name"]);
				$(character).remove();
				gameObj.defender = true;
				gameObj.createBox(gameObj["Current Enemy Name"], "defenderBox", "#defender", gameObj["Current Enemy Health Points"]);
			};
		},
		//Attack enemy to reduce their health. Your health decreases by enemy's counter attack power. Your attack power increases by original attack power.
		clickedAttack: function() {
			if(gameObj["Current Health Points"] > 0 && gameObj.defender === true && gameObj.gameEnded === false) {
				gameObj["Current Enemy Health Points"] -= gameObj["Current Attack Power"];
				$("#defender").empty();
				if(gameObj["Current Enemy Health Points"] > 0) {
					$("#yourCharacter").empty();
					gameObj["Current Health Points"] -= gameObj["Current Enemy Counter Attack Power"];
					$("#roundText").html("You attacked " + gameObj["Current Enemy Name"] + " for " + gameObj["Current Attack Power"] + " damage" +
						"<br>" + gameObj["Current Enemy Name"] + " attacked you back for " + gameObj["Current Enemy Counter Attack Power"] + " damage");
					gameObj.createBox(gameObj["Current Enemy Name"], "defenderBox", "#defender", gameObj["Current Enemy Health Points"]);
					gameObj.createBox(gameObj["Current Name"], "yourCharacterBox", "#yourCharacter", gameObj["Current Health Points"]);
				};
				gameObj["Current Attack Power"] += gameObj["Original Attack Power"];
				//When your health reaches 0, lose the game
				if(gameObj["Current Health Points"] < 1) {
					gameObj.gameEnded = true;
					$("#restartButton").css("visibility", "visible");
					$("#endText").html("You have been defeated... GAME OVER !!!");
				}
				//When no more enemies available and you defeat last defender, win the game
				if($(".enemiesAvailable").html().length === 0 && $("#defender").html().length === 0) {
					gameObj.gameEnded = true;
					$("#restartButton").css("visibility", "visible");
					$("#endText").html("YOU WON !!! GAME OVER !!!");
				}
				//When current defender health reaches 0, you choose another enemy
				else if(gameObj["Current Enemy Health Points"] < 1) {
					gameObj.defender = false;
					$("#endText").html("You have defeated " + gameObj["Current Enemy Name"] + ". You can choose to fight another enemy.");
				};
			}
		}

	};


	gameObj.resetGame();

	$(document).on("click", ".chooseCharacterBox", function() {
		gameObj.clickedCharacter(this);
	});

	$(document).on("click", ".enemiesAvailableBox", function() {
		gameObj.clickedEnemy(this);
	});

	$(document).on("click", "#attackButton", function() {
		gameObj.clickedAttack();
	});

	$(document).on("click", "#restartButton", function() {
		gameObj.resetGame();
	});

});