if (!Cookies.get('loggedIn') || Cookies.get('loggedIn') == 'false') {
    window.location = 'login.html';
}

let currentVersion = 1.0;

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
            nutrients[currentNutrients[i]].twoArrowCutoff = arr[arr.length-1] - (arr[arr.length-1] - arr[0]) * twoArrowUpperPercentile;
            nutrients[currentNutrients[i]].oneArrowCutoff = arr[arr.length - 1] - (arr[arr.length-1] - arr[0]) * oneArrowUpperPercentile;
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
        }
        else if (itemStats[stat] > nutrients[stat].oneArrowCutoff) {
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