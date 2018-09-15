$(document).ready(function() {

  $('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true
  });

  $(".save").on("click", function() {

    var thisId = $(this).attr("data-id");

    $.ajax({
      type: "POST",
      url: "/save/" + thisId,
      data: {
        _id: thisId
      }
    })
    location.reload();
  })

  $(".addNote").on("click", function(){
    
    $.ajax({
      type: "POST",
      dataType: "json",
      url:"/addNote/" + $(this).data("id"),
      data: {
        text: $("#noteText").val(),
        created: Date.now()
      }
    })
    location.reload();
  });


  $('.modal').modal();

  $(".notesButton").on("click", function(){
    $("#noteText").empty();
    var dataId = $(this).attr("data-id");

    $(".addNote").data("id", dataId)
    $("#articleId").text(dataId)

  });

  $(".deleteNote").on("click", function() {
    // Make an AJAX GET request to delete the notes from the db
    var thisId = $(this).data("id");
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "/delete/" + thisId,
      // On a successful call, clear the #results section

    });
    location.reload();
  });
  

});