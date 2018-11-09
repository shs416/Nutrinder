if (!Cookies.get('loggedIn') || Cookies.get('loggedIn') == 'false') {
    window.location = 'login.html';
}

let currentVersion = 1.0;

if (!Cookies.get('cacheVersion') || Number(Cookies.get('cacheVersion') < currentVersion)) {
    Cookies.set('savedRecipes', JSON.stringify([]));
    Cookies.set('savedIngredients', JSON.stringify([]));
    Cookies.set('cacheVersion', 1.0);
}