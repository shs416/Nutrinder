var sliderCardSpacing = 20;
var sliderIndex = 0;
var savedIngredients = [];

let twoArrowUpperPercentile = .45;
let oneArrowUpperPercentile = .9;

let sliderScrollSensitivity = 20;
var scrollSwipeDone = true;

let currentNutrients = ["calories", "totalfat", "carbs", "protein", "vitaminA", "vitaminC", "calcium", "iron"];

if (Cookies.get('savedIngredients')) {
    savedIngredients = JSON.parse(Cookies.get('savedIngredients'))
}

function addIngredientCards() {
    var preferences = JSON.parse(Cookies.get('preferences'));
    $.getJSON("database.json", function (result) {

        var ingredientCards = result.ingredients;
        var exploreSlider = document.getElementById('sliderDiv');

        var nutrients = {};
        currentNutrients.forEach(function (item, index) {
            nutrients[item] = {
                vals: []
            };
        });
        for (var i = 0; i < ingredientCards.length; i++) {
            for (var j = 0; j < currentNutrients.length; j++) {
                nutrients[currentNutrients[j]].vals.push(ingredientCards[i].stats[currentNutrients[j]]);
            }
        }
        for (var i = 0; i < currentNutrients.length; i++) {
            var arr = nutrients[currentNutrients[i]].vals;
            arr.sort(function (a, b) {
                return a - b;
            });
            nutrients[currentNutrients[i]].twoArrowCutoff = arr[arr.length - 1] - (arr[arr.length - 1] - arr[0]) * twoArrowUpperPercentile;
            nutrients[currentNutrients[i]].oneArrowCutoff = arr[arr.length - 1] - (arr[arr.length - 1] - arr[0]) * oneArrowUpperPercentile;
        }


        var numCards = 0;
        for (var i = 0; i < ingredientCards.length; i++) {

            var dietAllows = true;
            try {
                if (!ingredientCards[i].diet[preferences.diet]) dietAllows = false;
            } catch {}

            try {
                if (preferences.carbs == 'Low' && ingredientCards[i].stats.carbs > nutrients.carbs.twoArrowCutoff) {
                    dietAllows = false;
                }
            } catch {}

            try {
                if (preferences.carbs == 'High' && ingredientCards[i].stats.carbs < nutrients.carbs.twoArrowCutoff) {
                    dietAllows = false;
                }
            } catch {}

            try {
                if (preferences.protein == 'Low' && ingredientCards[i].stats.protein > nutrients.protein.twoArrowCutoff) {
                    dietAllows = false;
                }
            } catch {}

            try {
                if (preferences.protein == 'High' && ingredientCards[i].stats.protein < nutrients.protein.twoArrowCutoff) {
                    dietAllows = false;
                }
            } catch {}

            if (!dietAllows) {
                console.log('Not allowing', ingredientCards[i].name)
            }


            if (dietAllows) {

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

                var oneArrowStats = [];
                var twoArrowStats = [];
                for (var j = 0; j < currentNutrients.length; j++) {
                    if (ingredientCards[i].stats[currentNutrients[j]]) {

                        if (ingredientCards[i].stats[currentNutrients[j]] > nutrients[currentNutrients[j]].twoArrowCutoff) {

                            var statsNode = document.createElement('h6');
                            statsNode.innerHTML = "↑↑ " + currentNutrients[j] + " (" + ingredientCards[i].stats[currentNutrients[j]] + ")";
                            statsNode.style.color = "#07c41d";
                            twoArrowStats.push(statsNode);
                        } else if (ingredientCards[i].stats[currentNutrients[j]] > nutrients[currentNutrients[j]].oneArrowCutoff) {

                            var statsNode = document.createElement('h6');
                            statsNode.innerHTML = "↑ " + currentNutrients[j] + " (" + ingredientCards[i].stats[currentNutrients[j]] + ")";
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
                var leftVal = leftStart + ((sliderCard.offsetWidth + sliderCardSpacing) * numCards);
                sliderCard.style.left = leftVal + "px";
                sliderCard.index = i;

                sliderCard.style.zIndex = String(-1 * i);
                numCards++;
            }
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

function moveSliderLeft(speed) {
    animationDone = false;
    if (sliderIndex > 0) {
        $('.sliderCard').animate({
            left: "+=290"
        }, speed, function () {
            animationDone = true;
        });
        sliderIndex--;
    }
}

function moveSliderRight(speed) {
    animationDone = false;
    var numCards = document.getElementsByClassName('sliderCard').length - 1;
    if (sliderIndex < numCards) {
        $('.sliderCard').animate({
            left: "-=290"
        }, 200, function () {
            animationDone = true;
        });
        sliderIndex++;
    }
}

window.onload = function () {
    addIngredientCards();

    $('#sliderDiv').on('mousewheel DOMMouseScroll', function (e) {
        var delta = e.originalEvent.deltaX;
        if (delta < sliderScrollSensitivity && delta > -1 * sliderScrollSensitivity) {
            scrollSwipeDone = true;
        } else if (delta < -1 * sliderScrollSensitivity) {
            if (scrollSwipeDone) {
                scrollSwipeDone = false;
                moveSliderLeft(120);
            }
        } else if (delta > sliderScrollSensitivity) {
            if (scrollSwipeDone) {
                scrollSwipeDone = false;
                moveSliderRight(120);
            }
        }
        e.preventDefault();
    });
};

function updateSaved() {
    Cookies.set('savedIngredients', JSON.stringify(savedIngredients));
}
