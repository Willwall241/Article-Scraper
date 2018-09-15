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

  });


  $('.modal').modal();

  $(".notesButton").on("click", function(){
    $("#noteText").empty();
    var dataId = $(this).attr("data-id");

    $(".addNote").data("id", dataId)
    $("#articleId").text(dataId)

  });
  

});