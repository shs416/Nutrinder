// Check if logged in
if (!Cookies.get('loggedIn') || Cookies.get('loggedIn') == 'false' || !Cookies.get('username')) {
    window.location = 'login.html';
}

let currentVersion = 1.0;
var userRef = firebase.database().ref('users/' + Cookies.get('username'));
var foodDatabase;

function setUserState(featureName, data) {
    Cookies.set(featureName, JSON.stringify(data));

    if (userRef) {
        userRef.set({
            preferences: JSON.parse(Cookies.get('preferences')),
            savedIngredients: JSON.parse(Cookies.get('savedIngredients')),
            savedRecipes: JSON.parse(Cookies.get('savedRecipes'))
        });
    } else {
        console.log('Error saving state to Firebase');
    }
}


// Keep food database updated
firebase.database().ref('ingredients').on('value', function (ingredientSnapshot) {
    firebase.database().ref('recipes').on('value', function (recipeSnapshot) {
        var foodDatabase = {
            ingredients: ingredientSnapshot.val(),
            recipes: recipeSnapshot.val()
        }
        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
    });
});



if (!Cookies.get('cacheVersion') || Number(Cookies.get('cacheVersion') < currentVersion)) {
    Cookies.set('savedRecipes', JSON.stringify([]));
    Cookies.set('savedIngredients', JSON.stringify([]));
    Cookies.set('cacheVersion', 1.0);
}

var nutrients;
let twoArrowUpperPercentile = .45;
let oneArrowUpperPercentile = .9;
let currentNutrients = ["calories", "totalfat", "carbs", "protein", "vitaminA", "vitaminC", "calcium", "iron"];

function formatItemStats(ingredients, itemStats) {
    if (!nutrients) {
        nutrients = {};
        currentNutrients.forEach(function (item, index) {
            nutrients[item] = {
                vals: []
            };
        });
        for (var i = 0; i < ingredients.length; i++) {
            for (var j = 0; j < currentNutrients.length; j++) {
                nutrients[currentNutrients[j]].vals.push(ingredients[i].stats[currentNutrients[j]]);
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
    }

    outputStats = [];
    for (stat in itemStats) {
        var percentile = (itemStats[stat] - nutrients[stat].vals[0]) / (nutrients[stat].vals[nutrients[stat].vals.length - 1] - nutrients[stat].vals[0]);
        var name = null;
        var arrows = null;
        if (itemStats[stat] > nutrients[stat].twoArrowCutoff) {
            arrows = '↑↑';
            name = stat;
        } else if (itemStats[stat] > nutrients[stat].oneArrowCutoff) {
            arrows = '↑';
            name = stat;
        }
        if (name) outputStats.push([arrows, name, itemStats[stat], percentile]);
    }
    outputStats.sort(function (a, b) {
        return b[3] - a[3];
    });
    return outputStats;
}

addFooter();

function addFooter() {
    var footer = document.createElement('div');
    footer.classList = 'footer';
    footer.style.width = '100%';
    footer.style.height = '56px';
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.backgroundColor = '#ffffff';
    footer.style.boxShadow = '1px 1px 6px #aaaaaa';
    footer.style.zIndex = '999';

    var middleIconsDiv = document.createElement('div');
    middleIconsDiv.style.display = 'flex';
    middleIconsDiv.style.textAlign = 'center';
    middleIconsDiv.style.margin = '0 auto';
    middleIconsDiv.style.width = '210px';
    middleIconsDiv.style.textAlign = 'center';


    var iconNames = ['Saved', 'Explore', 'Preferences'];
    var iconPaths = ['/img/heart.png', '/img/star.png', '/img/gear.png'];
    var onclicks = ['index.html', 'explore.html', 'preferences.html'];
    for (var i = 0; i < 3; i++) {
        var midIcon = document.createElement('div');
        //        midIcon.style.padding = '5px';
        midIcon.style.margin = '7px 2px';
        midIcon.style.height = '40px';
        midIcon.style.width = '66px';
        midIcon.style.display = 'inline-block';
        midIcon.style.textAlign = 'center';
        let link = onclicks[i];
        midIcon.onclick = function() {
            window.location = link;
        };

        var img = new Image(30, 30);
        img.src = iconPaths[i];
        img.style.marginBottom = '2px';
        midIcon.appendChild(img);

        var iconText = document.createElement('h6');
        iconText.textContent = iconNames[i];
        iconText.style.fontSize = '10px';
        iconText.style.bottom = '0';
        midIcon.appendChild(iconText);
        middleIconsDiv.appendChild(midIcon);
    }


    footer.appendChild(middleIconsDiv);

    document.body.appendChild(footer);
}
