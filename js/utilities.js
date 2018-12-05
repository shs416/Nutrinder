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
        } else {
            arrows = '';
            name = stat;
        }
        if (name) outputStats.push([arrows, name, itemStats[stat], percentile]);
    }
    outputStats.sort(function (a, b) {
        return b[3] - a[3];
    });
    return outputStats;
}


function genPercPowerBar(percent) {
    var powerBarDiv = document.createElement('div');
    powerBarDiv.classList = 'powerBarDiv';
    var numDots = 10;
    for (var i = 0; i < numDots; i++) {
        var dot = document.createElement('div');
        if (percent < i / numDots) {
            dot.classList = 'dot lit';
        } else {
            dot.classList = 'dot';
        }
        if (percent < .3333 && percent > i / numDots) {
            dot.style.backgroundColor = 'yellow';
        } else if (percent < .6666 && percent > i / numDots) {
            dot.style.backgroundColor = 'greenyellow';
        } else if (percent > i / numDots) {
            dot.style.backgroundColor = 'lime';
        }
        powerBarDiv.appendChild(dot);
    }
    return powerBarDiv;
}


addHeader();

function addHeader() {
    var nav = document.createElement('nav');
    nav.id = 'mainNav';
    nav.classList = 'navbar navbar-expand-lg navbar-light fixed-top';
    var container = document.createElement('div');
    container.classList = 'container';
    var title = document.createElement('a');
    title.classList = 'navbar-brand js-scroll-trigger';
    title.href = 'index.html';
    title.textContent = 'Nütrinder';
    var logout = document.createElement('h6');
    logout.onclick = function () {
        Cookies.set('loggedIn', false);
        Cookies.set('loggedIn', null)
        window.location = 'login.html';
    }
    logout.textContent = 'Logout';
    container.appendChild(title);
    container.appendChild(logout);
    nav.appendChild(container);
    document.body.appendChild(nav);
}



addFooter();

function addFooter() {
    var footer = document.createElement('div');
    footer.id = 'footer';

    var middleIconsDiv = document.createElement('div');
    middleIconsDiv.id = 'middleIconsDiv';
    var iconNames = ['Saved', 'Explore', 'Preferences'];
    var iconPaths = ['fas fa-heart', 'fas fa-star', 'fas fa-cogs'];
    var onclicks = ['index.html', 'explore2.html', 'preferences.html'];
    for (var i = 0; i < 3; i++) {
        var midIcon = document.createElement('div');
        midIcon.classList = 'midIcon';
        let link = onclicks[i];
        midIcon.onclick = function () {
            window.location = link;
        };

        var icon = document.createElement('i');
        icon.classList = iconPaths[i];
        midIcon.appendChild(icon);

        var iconText = document.createElement('h6');
        iconText.textContent = iconNames[i];
        midIcon.appendChild(iconText);
        middleIconsDiv.appendChild(midIcon);

        if (window.location.href.includes(onclicks[i]) || (window.location.href.includes('saved') && i == 0) || (window.location.href.includes('explore') && i == 1)) {
            midIcon.style.color = '#50C878';
            iconText.style.color = '#50C878';
        }
    }

    footer.appendChild(middleIconsDiv);
    document.body.appendChild(footer);

    var prefs = JSON.parse(Cookies.get('preferences'));
    var hasPrefs = false;
    for (pref in prefs) {
        if (prefs[pref] != "No preference") {
            hasPrefs = true;
        }
    }
    if (!hasPrefs && window.location.href.includes('explore')) {
        var warningOuterDiv = document.createElement('div');
        warningOuterDiv.classList = 'warningOuterDiv';
        var prefWarningDiv = document.createElement('div');
        prefWarningDiv.classList = 'arrow_box';
        var warningText = document.createElement('h6');
        warningText.textContent = "Looks like you haven't set any dietary preferences yet, tap on Preferences to get started!";
        prefWarningDiv.appendChild(warningText);
        warningOuterDiv.appendChild(prefWarningDiv);
        document.body.appendChild(warningOuterDiv);
    }

}
