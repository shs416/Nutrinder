var preferences = {};
if (Cookies.get('preferences')) {
    preferences = JSON.parse(Cookies.get('preferences'));
    
    $(":radio[value=\'"+preferences.diet+"\']", "#dietForm").prop("checked", true);
    $('#dietButton').html(preferences.diet ? "Diet: " + preferences.diet : "Diet");
                          
    $(":radio[value=\'"+preferences.carbs+"\']", "#carbForm").prop("checked", true);
    $('#carbButton').html(preferences.carbs ? "Carbohydrates: " + preferences.carbs : "Carbohydrates");
                          
    $(":radio[value=\'"+preferences.protein+"\']", "#proteinForm").prop("checked", true);
    $('#proteinButton').html(preferences.protein ? "Protein: " + preferences.protein : "Protein");
}

function logout() {
    Cookies.set('loggedIn', false);
    window.location = 'login.html';
}

function savePreferences() {
    Cookies.set('preferences', JSON.stringify(preferences));
}

$('#dietForm input').on('change', function () {
    var target = $('#dietButton');
    target.html("Diet: " + $('input[name=radio1]:checked', '#dietForm').val());
    preferences.diet = $('input[name=radio1]:checked', '#dietForm').val();
    savePreferences();
    //    console.log($('input[name=radio1]:checked', '#dietForm').val());
});


$('#carbForm input').on('change', function () {
    var target = $('#carbButton');
    target.html("Carbohydrates: " + $('input[name=radio2]:checked', '#carbForm').val());
    preferences.carbs = $('input[name=radio2]:checked', '#carbForm').val();
    savePreferences();
    /*console.log("Carbohydrates: " + $('input[name=radio2]:checked', '#carbForm').val());*/
});

$('#proteinForm input').on('change', function () {
    var target = $('#proteinButton');
    target.html("Protein: " + $('input[name=radio3]:checked', '#proteinForm').val());
    preferences.protein = $('input[name=radio3]:checked', '#proteinForm').val();
    savePreferences();
    /*console.log("Protein: " + $('input[name=radio3]:checked', '#proteinForm').val());*/
});

/*
$('#form input').on('change', function() {
   var target = $('#dietButton');
   target.html("Diet: " + $('input[name=exampleRadios]:checked', '#form').val()); 
   console.log("Diet: " + $('input[name=exampleRadios]:checked', '#form').val());
});
*/