
$(document).on('click', function() {
  $('#srchresult, #srchresultmobile').html('');
})
$('#srchresult, #srchresultmobile').on('click', function(e) {
  e.stopPropagation()
})
$( ".input_search" ).on('keyup focus', function(e) {  
    e.stopPropagation()
    e.preventDefault();

    var srchvalue = $(this).val(); 
    $.ajax({
        url: '/search/suggest?section_id=predictive-search&q='+srchvalue,        
        type: 'GET',
        success: function(data) {
          $("#srchresult, #srchresultmobile").html(data);
          $("#srchresultmobile").html(data);
          // document.getElementById("srchresultmobile").innerHTML = data;
        }
     }).done(function(response){
      //  console.log(response);
     });
});

