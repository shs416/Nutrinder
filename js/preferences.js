$('#dietForm input').on('change', function() {
   var target = $('#dietButton');
   target.html("Diet: " + $('input[name=radio1]:checked', '#dietForm').val()); 
   /*console.log("Diet: " + $('input[name=radio1]:checked', '#dietForm').val());*/
});


$('#carbForm input').on('change', function() {
   var target = $('#carbButton');
   target.html("Carbohydrates: " + $('input[name=radio2]:checked', '#carbForm').val()); 
   /*console.log("Carbohydrates: " + $('input[name=radio2]:checked', '#carbForm').val());*/
});

$('#proteinForm input').on('change', function() {
   var target = $('#proteinButton');
   target.html("Protein: " + $('input[name=radio3]:checked', '#proteinForm').val()); 
   /*console.log("Protein: " + $('input[name=radio3]:checked', '#proteinForm').val());*/
});

/*
$('#form input').on('change', function() {
   var target = $('#dietButton');
   target.html("Diet: " + $('input[name=exampleRadios]:checked', '#form').val()); 
   console.log("Diet: " + $('input[name=exampleRadios]:checked', '#form').val());
});
*/