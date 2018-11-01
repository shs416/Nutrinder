var ingredientCards = [
    {
        name: "Chicken Breast",
        stats: "↑↑ Protein",
        imgLink: "https://www.onceuponachef.com/images/2010/06/6a0115721bb963970b013481996702970c-450wi.jpg",
        page: "ingredient_chickenBreast.html"
    },
    {
        name: "Spinach",
        stats: "↑↑ Vitamin Something",
        imgLink: "https://www.highmowingseeds.com/pub/media/catalog/product/cache/image/675x675/e9c3970ab036de70892d86c6d221abfe/2/8/2885.jpg",
        page: "ingredient_spinach.html"
    },
    {
        name: "Pasta",
        stats: "↑↑ Carbs",
        imgLink: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/2/4/1/RX-FNM_030111-Lighten-Up-012_s4x3.jpg.rend.hgtvcom.616.462.suffix/1382539856907.jpeg",
        page: "ingredient_pasta.html"
    }
]

var sliderCardSpacing = 20;
var sliderIndex = 0;
var savedIngredients = [];
if (Cookies.get('savedIngredients')) {
    savedIngredients = JSON.parse(Cookies.get('savedIngredients'))
}


function addIngredientCards() {
    var exploreSlider = document.getElementById('sliderDiv');

    for (var i = 0; i < ingredientCards.length; i++) {
        var sliderCard = document.createElement('div');
        sliderCard.className = 'sliderCard';

        var imgDiv = document.createElement('div');
        imgDiv.className = 'sliderImg';
        var img = document.createElement('img');
        img.src = ingredientCards[i].imgLink;
        imgDiv.appendChild(img);

        var img = document.createElement('img');
        img.className = "heartIcon";
        if (savedIngredients.indexOf(ingredientCards[i].name) > -1) {
            img.src = "img/heart_full.png";
        } else {
            img.src = "img/heart_empty.png";
        }
        img.onclick = function () {
            toggleHeart(this);
        };

        var nameNode = document.createElement('H3');
        var t_name = document.createTextNode(ingredientCards[i].name);
        nameNode.appendChild(t_name);

        var statsNode = document.createElement('H6');
        var t_stats = document.createTextNode(ingredientCards[i].stats);
        statsNode.appendChild(t_stats);

        sliderCard.appendChild(imgDiv);
        sliderCard.appendChild(img);
        sliderCard.appendChild(nameNode);
        sliderCard.appendChild(statsNode);
        
        let ingredient_URL = ingredientCards[i].page
        sliderCard.onclick = function(pointing) {
            if (!pointing.target.classList.contains('heartIcon')) {
                window.location = ingredient_URL;
            }
        }

        exploreSlider.appendChild(sliderCard);
        sliderCard.style.left = String((window.innerWidth / 2 - 135) + (sliderCard.offsetWidth+sliderCardSpacing) * i) + "px";
        sliderCard.style.zIndex = String(-1 * i);
    }
}

function toggleHeart(heart) {
    var ingName = heart.parentElement.getElementsByTagName('h3')[0].innerText;
    if (heart.src.includes("heart_empty.png")) {
        heart.src = "img/heart_full.png";
        savedIngredients.push(ingName);
        updateSaved();
    } else {
        heart.src = "img/heart_empty.png";
        for (var i = savedIngredients.length - 1; i >= 0; i--) {
            if (savedIngredients[i] == ingName) {
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