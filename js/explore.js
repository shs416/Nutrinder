var sliderCardSpacing = 20;
var sliderIndex = 0;
var savedIngredients = [];

let currentNutrients = ["calories", "totalfat", "carbs", "protein", "vitaminA", "vitaminC", "calcium", "iron"];

if (Cookies.get('savedIngredients')) {
    savedIngredients = JSON.parse(Cookies.get('savedIngredients'))
}

function addIngredientCards() {
    $.getJSON("database.json", function (result) {
        var ingredientCards = result.ingredients;
        var exploreSlider = document.getElementById('sliderDiv');

        for (var i = 0; i < ingredientCards.length; i++) {
            var sliderCard = document.createElement('div');
            sliderCard.className = 'sliderCard';

            var imgDiv = document.createElement('div');
            imgDiv.className = 'sliderImg';
            var img = document.createElement('img');
            img.src = ingredientCards[i].imgLink;
            imgDiv.appendChild(img);
            sliderCard.appendChild(imgDiv);

            var heartImg = document.createElement('img');
            heartImg.className = "heartIcon";
            if (savedIngredients.indexOf(i) > -1) {
                heartImg.src = "img/heart_full.png";
            } else {
                heartImg.src = "img/heart_empty.png";
            }
            heartImg.onclick = function () {
                toggleHeart(this);
            };
            sliderCard.appendChild(heartImg);

            var nameNode = document.createElement('h3');
            nameNode.innerHTML = ingredientCards[i].name;
            sliderCard.appendChild(nameNode);

            var nutriStats = result.thresholds;
            var oneArrowStats = [];
            var twoArrowStats = [];
            for (var j = 0; j < currentNutrients.length; j++) {
                if (ingredientCards[i].stats[currentNutrients[j]]) {
                    if (ingredientCards[i].stats[currentNutrients[j]] > nutriStats[currentNutrients[j]].twoArrow) {
                        var statsNode = document.createElement('h6');
                        statsNode.innerHTML = "↑↑ "+currentNutrients[j]+" ("+ingredientCards[i].stats[currentNutrients[j]]+")";
                        statsNode.style.color = "#07c41d";
                        twoArrowStats.push(statsNode);
                    } else if (ingredientCards[i].stats[currentNutrients[j]] > nutriStats[currentNutrients[j]].oneArrow) {
                        var statsNode = document.createElement('h6');
                        statsNode.innerHTML = "↑ "+currentNutrients[j]+" ("+ingredientCards[i].stats[currentNutrients[j]]+")";
                        statsNode.style.color = "#8ef29a";
                        oneArrowStats.push(statsNode);
                    }
                }
            }
            for (var j = 0; j < twoArrowStats.length; j++) {
                sliderCard.appendChild(twoArrowStats[j]);
            }
            for (var j = 0; j < oneArrowStats.length; j++) {
                sliderCard.appendChild(oneArrowStats[j]);
            }

            let inputIngredientID = i;
            sliderCard.onclick = function (pointing) {
                if (!pointing.target.classList.contains('heartIcon')) {
                    Cookies.set('ingredientInputID', inputIngredientID);
                    window.location = 'ingredient.html';
                }
            }

            exploreSlider.appendChild(sliderCard);
            var leftStart = (window.innerWidth / 2) - (sliderCard.offsetWidth / 2)
            var leftVal = leftStart + ((sliderCard.offsetWidth + sliderCardSpacing) * i);
            sliderCard.style.left = String(leftVal) + "px";
            sliderCard.index = i;

            sliderCard.style.zIndex = String(-1 * i);
        }
    });
}

function toggleHeart(heart) {
    var ingIndex = heart.parentElement.index;
    if (heart.src.includes("heart_empty.png")) {
        heart.src = "img/heart_full.png";
        savedIngredients.push(ingIndex);
        updateSaved();
    } else {
        heart.src = "img/heart_empty.png";
        for (var i = savedIngredients.length - 1; i >= 0; i--) {
            if (savedIngredients[i] == ingIndex) {
                savedIngredients.splice(i, 1);
            }
        }
        updateSaved();
    }
}

function moveSliderLeft() {
    if (sliderIndex > 0) {
        $('.sliderCard').animate({
            left: "+=290"
        }, 200);
        sliderIndex--;
    }
}

function moveSliderRight() {
    var numCards = document.getElementsByClassName('sliderCard').length - 1;
    if (sliderIndex < numCards) {
        $('.sliderCard').animate({
            left: "-=290"
        }, 200);
        sliderIndex++;
    }
}

window.onload = function () {
    addIngredientCards();
    //    generateNutrientStats();
};

function updateSaved() {
    Cookies.set('savedIngredients', JSON.stringify(savedIngredients));
}





function generateNutrientStats() {
    $.getJSON("database.json", function (result) {
        var nutrients = [[], [], [], [], [], [], [], []];
        for (var i = 0; i < result.ingredients.length; i++) {
            nutrients[0].push(result.ingredients[i].stats.calories);
            nutrients[1].push(result.ingredients[i].stats.totalfat);
            nutrients[2].push(result.ingredients[i].stats.carbs);
            nutrients[3].push(result.ingredients[i].stats.protein);
            nutrients[4].push(result.ingredients[i].stats.vitaminA);
            nutrients[5].push(result.ingredients[i].stats.vitaminC);
            nutrients[6].push(result.ingredients[i].stats.calcium);
            nutrients[7].push(result.ingredients[i].stats.iron);
        }

        for (var i = 0; i < nutrients.length; i++) {
            nutrients[i].sort(function (a, b) {
                return a - b
            });
            console.log("\"nutrient\": {")
            console.log("\"normal\": " + nutrients[i][parseInt(1 * nutrients[i].length / 4)] + ",");
            console.log("\"oneArrow\": " + nutrients[i][parseInt(2 * nutrients[i].length / 4)] + ",");
            console.log("\"twoArrow\": " + nutrients[i][parseInt(3 * nutrients[i].length / 4)] + ",");
            console.log("},")
        }

        console.log(nutrients[0]);
    });
}
