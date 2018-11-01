var ingredientCards = [
    {
        name: "Chicken Breast",
        stats: "↑↑ Protein",
        imgLink: "https://www.onceuponachef.com/images/2010/06/6a0115721bb963970b013481996702970c-450wi.jpg"
    },
    {
        name: "Spinach",
        stats: "↑↑ Vitamin Something",
        imgLink: "https://www.highmowingseeds.com/pub/media/catalog/product/cache/image/675x675/e9c3970ab036de70892d86c6d221abfe/2/8/2885.jpg"
    },
    {
        name: "Pasta",
        stats: "↑↑ Carbs",
        imgLink: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/2/4/1/RX-FNM_030111-Lighten-Up-012_s4x3.jpg.rend.hgtvcom.616.462.suffix/1382539856907.jpeg"
    }
]


var sliderIndex = 0;


function addIngredientCards() {
    var exploreSlider = document.getElementById('sliderDiv');
    var screenWidth = screen.width;

    for (var i = 0; i < ingredientCards.length; i++) {
        var sliderCard = document.createElement('div');
        sliderCard.className = 'sliderCard';

        var imgDiv = document.createElement('div');
        imgDiv.className = 'sliderImg';
        var img = document.createElement('img');
        img.src = ingredientCards[i].imgLink;
        imgDiv.appendChild(img);

        var nameNode = document.createElement('H3');
        var t_name = document.createTextNode(ingredientCards[i].name);
        nameNode.appendChild(t_name);

        var statsNode = document.createElement('H6');
        var t_stats = document.createTextNode(ingredientCards[i].stats);
        statsNode.appendChild(t_stats);

        sliderCard.appendChild(imgDiv);
        sliderCard.appendChild(nameNode);
        sliderCard.appendChild(statsNode);

        sliderCard.style.left = String((screenWidth / 2 - 135) + 290 * i) + "px";
        sliderCard.style.zIndex = String(-1 * i);
        exploreSlider.appendChild(sliderCard);
    }
}

function moveSliderLeft() {
    if (sliderIndex > 0) {
        $('.sliderCard').animate({left: "+=290"}, 200);
        sliderIndex--;
    }
}

function moveSliderRight() {
    var numCards = document.getElementsByClassName('sliderCard').length-1;
    if (sliderIndex < numCards) {
        $('.sliderCard').animate({left: "-=290"}, 200);
        sliderIndex++;
    }
}

window.onload = function () {
    addIngredientCards();
};
