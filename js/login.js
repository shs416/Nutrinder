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

function checkLogin() {
    var authenticated = false;
    for (var i = 0; i < usernamePasswordPairs.length; i++) {
        if ($('#usernameField').val() == usernamePasswordPairs[i][0] && $('#passwordField').val() == usernamePasswordPairs[i][1]) {
            authenticated = true;
        }
    }
    if (authenticated) {
        Cookies.set('loggedIn', true);
        window.location = 'index.html';
    } else {
        Cookies.set('loggedIn', false);
        $('#loginStatus').text('Incorrect username or password');
    }
    return false;
}