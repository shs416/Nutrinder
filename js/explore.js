var sliderCardSpacing = 20;
var sliderIndex = 0;
var savedIngredients = [];
var numCards = 0;

let maxStatsShown = 3;
let sliderScrollSensitivity = 20;
var scrollSwipeDone = true;


if (Cookies.get('savedIngredients')) {
    savedIngredients = JSON.parse(Cookies.get('savedIngredients'))
}

function addIngredientCards() {
    var preferences = {};
    if (Cookies.get('preferences')) {
        preferences = JSON.parse(Cookies.get('preferences'));
    }

    var result = JSON.parse(localStorage.getItem('foodDatabase'));

    var ingredientCards = result.ingredients;
    var exploreSlider = document.getElementById('sliderDiv');

    for (var i = 0; i < ingredientCards.length; i++) {

        var statsList = formatItemStats(ingredientCards, ingredientCards[i].stats);

        var dietAllows = true;
        try {
            if (ingredientCards[i].diet[preferences.diet] == false) dietAllows = false;
            //                console.log('Diet doesnt allow', ingredientCards[i].name);
        } catch {}

        try {
            if (preferences.carbs == 'Low' && ingredientCards[i].stats.carbs > nutrients.carbs.twoArrowCutoff) {
                dietAllows = false;
                //                    console.log('Too high carbs in', ingredientCards[i].name);
            }
        } catch {}

        try {
            if (preferences.carbs == 'High' && ingredientCards[i].stats.carbs < nutrients.carbs.oneArrowCutoff) {
                dietAllows = false;
                //                    console.log('Too low carbs in', ingredientCards[i].name);
            }
        } catch {}

        try {
            if (preferences.protein == 'Low' && ingredientCards[i].stats.protein > nutrients.protein.twoArrowCutoff) {
                dietAllows = false;
                //                    console.log('Too high protein in', ingredientCards[i].name);
            }
        } catch {}

        try {
            if (preferences.protein == 'High' && ingredientCards[i].stats.protein < nutrients.protein.oneArrowCutoff) {
                dietAllows = false;
                //                    console.log('Too low protein in', ingredientCards[i].name);
            }
        } catch {}


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


            var statsListNode = document.createElement('div');
            statsListNode.classList = 'tooltipDiv';
            var statsToolTip = document.createElement('span');
            statsToolTip.classList = 'tooltiptext';
            statsToolTip.textContent = '↑ is >20% of your daily needs, ↑↑ is >60% of your daily needs';
            statsListNode.appendChild(statsToolTip);
            for (var j = 0; j < (statsList.length > maxStatsShown ? maxStatsShown : statsList.length); j++) {
                var statsNode = document.createElement('h6');
                statsNode.innerHTML = statsList[j][0] + ' ' + statsList[j][1];
                if (statsList[j] == '↑') statsNode.style.color = "#8ef29a";
                else if (statsList[j] == '↑↑') statsNode.style.color = "#07c41d";
                statsListNode.appendChild(statsNode);
            }
            sliderCard.appendChild(statsListNode);

            let inputIngredientID = i;
            sliderCard.onclick = function (pointing) {
                if (!pointing.target.classList.contains('heartIcon')) {
                    Cookies.set('ingredientInputID', inputIngredientID);
                    window.location = 'ingredient.html';
                }
            }

            exploreSlider.appendChild(sliderCard);
            var leftStart = (window.innerWidth / 2) - (sliderCard.offsetWidth / 2)

            if (Cookies.get('cardOffset')) {
                sliderIndex = Cookies.get('cardOffset');
            }
            var leftVal = leftStart + ((sliderCard.offsetWidth + sliderCardSpacing) * numCards) + ((-1*sliderIndex)*(sliderCard.offsetWidth + sliderCardSpacing));
            
            sliderCard.style.left = leftVal + "px";
            sliderCard.index = i;

            sliderCard.style.zIndex = String(-1 * i);
            numCards++;
            
            updateArrowButtonVisibility();
        }
    }
}

function updateArrowButtonVisibility() {
    if (sliderIndex == 0) {
        document.getElementById('arrow-left').style.visibility = 'hidden';
    } else {
        document.getElementById('arrow-left').style.visibility = 'inherit';
    }
    if (sliderIndex == numCards-1) {
        document.getElementById('arrow-right').style.visibility = 'hidden';
    } else {
        document.getElementById('arrow-right').style.visibility = 'inherit';
    }
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
        Cookies.set('cardOffset', sliderIndex);
    }
    updateArrowButtonVisibility();
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
        Cookies.set('cardOffset', sliderIndex);
    }
    updateArrowButtonVisibility();
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
    setUserState('savedIngredients', savedIngredients);
}
