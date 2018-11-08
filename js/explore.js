var sliderCardSpacing = 20;
var sliderIndex = 0;
var savedIngredients = [];

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

            for (var j = 0; j < ingredientCards[i].stats.length; j++) {
                var statsNode = document.createElement('h6');
                statsNode.innerHTML = ingredientCards[i].stats[j];
                sliderCard.appendChild(statsNode);
            }

            let inputIngredientID = i;
            sliderCard.onclick = function (pointing) {
                if (!pointing.target.classList.contains('heartIcon')) {
                    Cookies.set('ingredientInputID', inputIngredientID);
                    window.location = 'ingredient.html';
                }
            }

            exploreSlider.appendChild(sliderCard);
            var leftStart = (window.innerWidth/2)-(sliderCard.offsetWidth/2)
            var leftVal = leftStart + ((sliderCard.offsetWidth+sliderCardSpacing)*i);
            sliderCard.style.left = String(leftVal) + "px";
            sliderCard.index = i;
            
            console.log("leftVal="+leftVal);
            console.log("extra="+(sliderCard.offsetWidth+sliderCardSpacing)*i);
            console.log("leftStart="+leftStart);
            console.log("cardWidth="+sliderCard.offsetWidth);
            console.log("")
            
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
};

function updateSaved() {
    Cookies.set('savedIngredients', JSON.stringify(savedIngredients));
}
