let usernamePasswordPairs = [
    ['test', 'test'],
    ['admin', 'admin'],
    ['shiva', 'password'],
    ['hunter', 'password'],
    ['marko', 'password'],
    ['Shiva', 'password'],
    ['Hunter', 'password'],
    ['Marko', 'password'],
    ['priyan', 'priyan'],
    ['Priyan', 'password'],
    ['priyan', 'password']
]

// When log in button is clicked
function checkLogin() {
    var authenticated = false;
    for (var i = 0; i < usernamePasswordPairs.length; i++) {
        if ($('#usernameField').val() == usernamePasswordPairs[i][0] && $('#passwordField').val() == usernamePasswordPairs[i][1]) {
            authenticated = true;
        }
    }
    if (authenticated) {
        var newUsername = $('#usernameField').val();
        Cookies.set('loggedIn', true);
        Cookies.set('username', newUsername);

        userRef = firebase.database().ref('users/' + newUsername);
        userRef.on('value', function (snapshot) {
            if (!snapshot.val()) {
                // Create default preferences
                userRef.set({
                    preferences: {
                        protein: "No preference",
                        diet: "No preference",
                        carbs: "No preference"
                    },
                    savedIngredients: [],
                    savedRecipes: []
                });
            } else {
                for (setting in snapshot.val()) {
                    Cookies.set(setting, JSON.stringify(snapshot.val()[setting]));
                }

                firebase.database().ref('ingredients').on('value', function (ingredientSnapshot) {
                    firebase.database().ref('recipes').on('value', function (recipeSnapshot) {
                        var foodDatabase = {
                            ingredients: ingredientSnapshot.val(),
                            recipes: recipeSnapshot.val()
                        }
                        localStorage.setItem('foodDatabase', JSON.stringify(foodDatabase));
                        window.location = 'index.html';
                    });
                });
            }
        });

    } else {
        Cookies.set('loggedIn', false);
        $('#loginStatus').text('Incorrect username or password');
    }
    return false;
}
